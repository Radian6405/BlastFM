import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
import redis from "../cache";
import { getSong } from "./spotify/helpers/getSpotify";
import { access } from "fs";
import { song } from "../types/interfaces";
import { createArtists, createSongs } from "./spotify/helpers/create";
const router: Router = Router();

// to ADD song to liked songs
router.post(
  "/like",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { spotify_id, access_token } = req.body;
    if (spotify_id == null || access_token == null) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { spotify_id, access_token } = req.body;
    try {
      // checking if song exists
      const song = await pool.query(
        "SELECT * FROM songs WHERE spotify_id = $1",
        [spotify_id]
      );
      if (Number(song.rowCount) === 0) {
        // create song from spotify
        const getNewSong: song | null = await getSong(access_token, spotify_id);
        if (getNewSong == null) {
          res.status(400).send({ message: "Could not create song" });
          return;
        }

        // creating artists and song
        const newArtists = await createArtists(getNewSong.artists);
        const newSong = await createSongs([getNewSong]);
        if (newSong === 0) {
          res.status(400).send({ message: "Could not create song" });
          return;
        }
      }

      // checking if relation already exists
      const relation = await pool.query(
        "SELECT * FROM liked_songs WHERE user_id = $1 AND song_id = (SELECT id FROM songs WHERE spotify_id = $2);",
        [req.user?.id, spotify_id]
      );
      if (Number(relation.rowCount) > 0) {
        res.status(200).send({
          message: "Song is already liked",
        });
        return;
      }

      const newRelation = await pool.query(
        "INSERT INTO liked_songs(user_id,song_id) VALUES($1,(SELECT id FROM songs WHERE spotify_id = $2));",
        [req.user?.id, spotify_id]
      );
      if (Number(newRelation.rowCount) > 0) {
        res.sendStatus(201);
        await redis.HDEL("LIKED_SONGS", String(req.user?.id));
      } else
        res.status(400).send({
          message: "Could not like the song",
        });
    } catch (error) {
      console.log("Error at POST /song/like route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to REMOVE song from liked songs
router.delete(
  "/like",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { spotify_id } = req.query;
    if (spotify_id == null) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { spotify_id } = req.query;
    try {
      // checking if song exists
      const song = await pool.query(
        "SELECT * FROM songs WHERE spotify_id = $1",
        [spotify_id]
      );
      if (Number(song.rowCount) === 0) {
        res.status(400).send({
          message: "Song does not exist",
        });
        return;
      }

      // checking if relation exists
      const relation = await pool.query(
        "SELECT * FROM liked_songs WHERE user_id = $1 AND song_id = (SELECT id FROM songs WHERE spotify_id = $2);",
        [req.user?.id, spotify_id]
      );
      if (Number(relation.rowCount) === 0) {
        res.status(200).send({
          message: "Song is not in the liked list",
        });
        return;
      }

      const newRelation = await pool.query(
        "DELETE FROM liked_songs WHERE user_id = $1 AND song_id = (SELECT id FROM songs WHERE spotify_id = $2);",
        [req.user?.id, spotify_id]
      );
      if (Number(newRelation.rowCount) > 0) {
        res.sendStatus(200);
        redis.HDEL("LIKED_SONGS", String(req.user?.id));
      } else
        res.status(400).send({
          message: "Could not remove the liked song",
        });
    } catch (error) {
      console.log("Error at DELETE /song/like route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to READ all liked songs
router.get(
  "/liked-list",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    // cache check
    const check = await redis.HGET("LIKED_SONGS", String(req.user.id));
    // console.log("songlist check:", check !== null);

    if (check != null) {
      // cache hit
      res.status(200).send({ songs: JSON.parse(check) });
    } else {
      // cache miss
      let songsData;
      try {
        songsData = await pool.query(
          `SELECT s.id, s.name, s.playtime, s.cover_image, s.spotify_id,
          jsonb_agg(jsonb_build_object('id',a.id, 'name', a.name)) as artists,
          true AS is_liked 
          FROM liked_songs ls 
          INNER JOIN songs s ON s.id = ls.song_id 
          INNER JOIN artists_songs ars ON ars.song_id = s.id 
          INNER JOIN artists a ON a.id = ars.artist_id 
          WHERE ls.user_id = $1 
          GROUP BY s.id,s.name,s.playtime, s.cover_image, s.spotify_id
          `,
          [req.user.id]
        );

        if (Number(songsData.rowCount) > 0)
          res.status(200).send({ songs: songsData.rows });
        else {
          res.status(400).send({
            message: "Could not get liked songs list",
          });
          return;
        }
      } catch (error) {
        console.log("Error at GET /song/liked route:\n", error);
        res.sendStatus(500);
      }

      // cache data
      const updateSongs = await redis.HSET(
        "LIKED_SONGS",
        String(req.user.id),
        JSON.stringify(songsData?.rows)
      );
      await redis.EXPIRE("LIKED_SONGS", 60 * 60 * 24, "NX");

      // console.log("updated songs list:", updateSongs);
    }
  }
);

// to READ a song's detail
router.get(
  "/details",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    try {
      const songDetails = await pool.query(
        `SELECT s.id, s.name, s.playtime, s.cover_image, s.spotify_id,
            jsonb_agg(jsonb_build_object('id',a.id, 'name', a.name)) as artists,
            CASE 
              WHEN EXISTS (
                SELECT 1 FROM liked_songs ls 
                WHERE ls.song_id = s.id AND ls.user_id = $2
              ) THEN true
              ELSE false
            END AS is_liked
        FROM songs s
        INNER JOIN artists_songs ars ON ars.song_id = s.id
        INNER JOIN artists a ON a.id = ars.artist_id
        WHERE s.id = $1
        GROUP BY s.id,s.name,s.playtime, s.cover_image, s.spotify_id
        `,
        [id, req.user?.id ?? 0]
      );

      if (Number(songDetails.rowCount) > 0)
        res.status(200).send(songDetails.rows[0]);
      else
        res.status(400).send({
          message: "Song does not exist",
        });
    } catch (error) {
      console.log("Error at GET /song/details route:\n", error);
      res.sendStatus(500);
    }
  }
);

export default router;
