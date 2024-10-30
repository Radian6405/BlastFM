import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
import redis from "../cache";
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

    const { id } = req.body;
    if (id === undefined || id === null) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    try {
      // checking if song exists
      const song = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
      if (Number(song.rowCount) === 0) {
        res.status(400).send({
          message: "Song does not exist",
        });
        return;
      }

      // checking if relation already exists
      const relation = await pool.query(
        "SELECT * FROM liked_songs WHERE user_id = $1 AND song_id = $2;",
        [req.user?.id, id]
      );
      if (Number(relation.rowCount) > 0) {
        res.status(400).send({
          message: "Song is already liked",
        });
        return;
      }

      const newRelation = await pool.query(
        "INSERT INTO liked_songs(user_id,song_id) VALUES($1,$2);",
        [req.user?.id, id]
      );
      if (Number(newRelation.rowCount) > 0) res.sendStatus(201);
      else
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

    const { id } = req.query;
    if (id === undefined || id === null) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    try {
      // checking if song exists
      const song = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);
      if (Number(song.rowCount) === 0) {
        res.status(400).send({
          message: "Song does not exist",
        });
        return;
      }

      // checking if relation exists
      const relation = await pool.query(
        "SELECT * FROM liked_songs WHERE user_id = $1 AND song_id = $2;",
        [req.user?.id, id]
      );
      if (Number(relation.rowCount) === 0) {
        res.status(400).send({
          message: "Song is not in the liked list",
        });
        return;
      }

      const newRelation = await pool.query(
        "DELETE FROM liked_songs WHERE user_id = $1 AND song_id = $2;",
        [req.user?.id, id]
      );
      if (Number(newRelation.rowCount) > 0) res.sendStatus(200);
      else
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

    if (check !== null && check !== undefined) {
      // cache hit
      res.status(200).send({ songs: JSON.parse(check) });
    } else {
      // cache miss
      let songsData;
      try {
        songsData = await pool.query(
          `SELECT s.id, s.name, s.playtime, s.cover_image,jsonb_agg(jsonb_build_object('id',a.id, 'name', a.name)) as artists 
          FROM liked_songs ls 
          INNER JOIN songs s ON s.id = ls.song_id 
          INNER JOIN artists_songs ars ON ars.song_id = s.id 
          INNER JOIN artists a ON a.id = ars.artist_id 
          WHERE ls.user_id = $1 
          GROUP BY s.id,s.name,s.playtime, s.cover_image
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    try {
      const songDetails = await pool.query(
        `SELECT s.id, s.name, s.playtime, s.cover_image, jsonb_agg(jsonb_build_object('id',a.id, 'name', a.name)) as artists
            FROM songs s
            INNER JOIN artists_songs ars ON ars.song_id = s.id
            INNER JOIN artists a ON a.id = ars.artist_id
            WHERE s.id = $1
            GROUP BY s.id,s.name,s.playtime, s.cover_image
          `,
        [id]
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
