import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
import redis from "../cache";
const router: Router = Router();

// to CREATE a playlist
router.post(
  "/create",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    const { name, description, is_private } = req.body;

    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }
    if (
      name === undefined ||
      name === null ||
      is_private === null ||
      is_private === undefined
    ) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }
    if (typeof name !== "string" || name.length > 16) {
      //TODO after updating database: 16 to 32
      res.status(400).send({
        message: "Invalid playlist name",
      });
      return;
    }
    if (typeof description === "string" && description.length > 32) {
      //TODO after updating database: 32 to 256
      res.status(400).send({
        message: "Invalid playlist description",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response) => {
    const { name, description, is_private } = req.body;

    try {
      const newPlaylist = await pool.query(
        "INSERT INTO playlists(name, description, owner_id, is_private) VALUES($1, $2, $3, $4);",
        [name, description ?? null, req.user?.id, is_private]
      );

      if (Number(newPlaylist?.rowCount) > 0) res.sendStatus(201);
      else {
        res.status(400).send({
          message: "Could not create playlist",
        });
      }
    } catch (error) {
      console.log("Error at /playlist/create route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to DELETE a playlist
router.delete(
  "/delete",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (id === null || id === undefined) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { id } = req.query;

    try {
      const deletedPlaylist = await pool.query(
        "DELETE FROM playlists WHERE id = $1;",
        [id]
      );

      if (Number(deletedPlaylist?.rowCount) > 0) res.sendStatus(200);
      else {
        res.status(400).send({
          message: "Could not delete playlist",
        });
      }
    } catch (error) {
      console.log("Error at /playlist/delete route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to READ details of a playlist
router.get(
  "/details",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (id === null || id === undefined) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    try {
      const playlist = await pool.query(
        `SELECT p.id, p.name,p.description,p.cover_image,p.owner_id,p.total_playtime, p.track_count, p.is_private ,u.username as owner_username 
        FROM playlists p 
        INNER JOIN users u ON u.id = p.owner_id 
        WHERE p.id = $1;`,
        [id]
      );

      if (Number(playlist.rowCount) > 0) {
        // for private playlists checking for ownership
        if (playlist.rows[0].is_private) {
          if (req.user !== null && req.user.id === playlist.rows[0].owner_id)
            res.status(200).send({ ...playlist.rows[0] });
          else
            res
              .status(401)
              .send({ message: "This playlist is set to private" });
        }
        // public playlists have no ownership check
        else res.status(200).send({ ...playlist.rows[0] });
      } else {
        res.status(400).send({
          message: "Could not read playlist details",
        });
      }
    } catch (error) {
      console.log("Error at GET /playlist/details route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to READ song list of a playlist
router.get(
  "/songlist",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    if (id === null || id === undefined) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    try {
      const playlist = await pool.query(
        "SELECT * FROM playlists WHERE id = $1;",
        [id]
      );
      if (Number(playlist.rowCount) === 0) {
        res.status(400).send({
          message: "Could not read playlist songs",
        });
        return;
      }

      // cache check
      const check = await redis.HGET("PLAYLIST_SONGS", String(id));

      if (check != null) {
        // cache hit

        // for private playlists checking for ownership
        if (playlist.rows[0].is_private) {
          if (req.user !== null && req.user.id === playlist.rows[0].owner_id)
            res.status(200).send({ songs: JSON.parse(check) });
          else
            res
              .status(401)
              .send({ message: "This playlist is set to private" });
        }
        // public playlists have no ownership check
        else res.status(200).send({ songs: JSON.parse(check) });
      } else {
        // cache miss
        const playlistSongs = await pool.query(
          `SELECT s.id, s.name, s.playtime, s.cover_image, 
          jsonb_agg(jsonb_build_object('id',a.id,'name',a.name)) as artists,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM liked_songs ls 
              WHERE ls.song_id = s.id AND ls.user_id = $2
            ) THEN true
            ELSE false
          END AS is_liked
          FROM playlists_songs ps 
          INNER JOIN songs s ON s.id = ps.song_id 
          INNER JOIN artists_songs ars ON ars.song_id = s.id 
          INNER JOIN artists a ON a.id = ars.artist_id 
          WHERE playlist_id = $1 
          GROUP BY s.id,s.name,s.playtime, s.cover_image
        `,
          [id, req.user?.id ?? 0]
        );

        // for private playlists checking for ownership
        if (playlist.rows[0].is_private) {
          if (req.user !== null && req.user.id === playlist.rows[0].owner_id) {
            res.status(200).send({ songs: playlistSongs.rows });
            await redis.HSET(
              "PLAYLIST_SONGS",
              String(id),
              JSON.stringify(playlistSongs.rows)
            );
            await redis.EXPIRE("PLAYLIST_SONGS", 60 * 60 * 24, "NX");
          } else
            res
              .status(401)
              .send({ message: "This playlist is set to private" });
        }
        // public playlists have no ownership check
        else {
          res.status(200).send({ songs: playlistSongs.rows });
          await redis.HSET(
            "PLAYLIST_SONGS",
            String(id),
            JSON.stringify(playlistSongs.rows)
          );
          await redis.EXPIRE("PLAYLIST_SONGS", 60 * 60 * 24, "NX");
        }
      }
    } catch (error) {
      console.log("Error at GET /playlist/songlist route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to READ list of user's playlists
router.get(
  "/user-playlists",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    try {
      const playlists = await pool.query(
        "SELECT * FROM playlists WHERE owner_id = $1;",
        [req.user.id]
      );
      res.status(200).send({ playlists: playlists.rows });
    } catch (error) {
      console.log("Error at GET /playlist/user-playlists route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to ADD songs to a playlist
router.post(
  "/add",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { song_id, playlist_id } = req.body;
    if (
      song_id === undefined ||
      song_id === null ||
      playlist_id === null ||
      playlist_id === undefined
    ) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { song_id, playlist_id } = req.body;

    try {
      // checking if relation alreaDY exists
      const relation = await pool.query(
        "SELECT * FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2;",
        [playlist_id, song_id]
      );
      if (Number(relation.rowCount) > 0) {
        res.status(400).send({
          message: "Song Already exists in the playlist",
        });
        return;
      }

      //checking if current user is the owner of playlist
      const playlist = await pool.query(
        "SELECT * FROM playlists WHERE id = $1 AND owner_id = $2",
        [playlist_id, req.user?.id]
      );
      if (Number(playlist.rowCount) === 0) {
        res.status(401).send({
          message: "You cannot edit this playlist",
        });
        return;
      }

      const newRelation = await pool.query(
        "INSERT INTO playlists_songs(playlist_id,song_id) VALUES($1,$2);",
        [playlist_id, song_id]
      );
      if (Number(newRelation.rowCount) > 0) {
        const updatePlaylist = await pool.query(
          `UPDATE playlists 
          SET 
            track_count = track_count + 1, 
            total_playtime = total_playtime + (
              SELECT playtime 
              FROM songs 
              WHERE id = $1
            )  
            WHERE id = $2;`,
          [song_id, playlist_id]
        );

        res.sendStatus(201);
        redis.HDEL("PLAYLIST_SONGS", String(playlist_id));
      } else
        res.status(400).send({
          message: "Could not add song to the playlist",
        });
    } catch (error) {
      console.log("Error at /song/add route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to REMOVE songs from a playlist
router.delete(
  "/remove",
  aucthenticateJWT,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { song_id, playlist_id } = req.query;
    if (
      song_id === undefined ||
      song_id === null ||
      playlist_id === null ||
      playlist_id === undefined
    ) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { song_id, playlist_id } = req.query;

    try {
      // checking if relation exists
      const relation = await pool.query(
        "SELECT * FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2;",
        [playlist_id, song_id]
      );
      if (Number(relation.rowCount) === 0) {
        res.status(400).send({
          message: "Song does not exist in the playlist",
        });
        return;
      }

      //checking if current user is the owner of playlist
      const playlist = await pool.query(
        "SELECT * FROM playlists WHERE id = $1 AND owner_id = $2",
        [playlist_id, req.user?.id]
      );
      if (Number(playlist.rowCount) === 0) {
        res.status(401).send({
          message: "You cannot edit this playlist",
        });
        return;
      }

      const newRelation = await pool.query(
        "DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2;",
        [playlist_id, song_id]
      );
      if (Number(newRelation.rowCount) > 0) {
        const updatePlaylist = await pool.query(
          `UPDATE playlists 
          SET 
            track_count = track_count - 1, 
            total_playtime = total_playtime - (
              SELECT playtime 
              FROM songs 
              WHERE id = $1
            )  
            WHERE id = $2;`,
          [song_id, playlist_id]
        );
        res.sendStatus(200);
        redis.HDEL("PLAYLIST_SONGS", String(playlist_id));
      } else
        res.status(400).send({
          message: "Could not delete song from the playlist",
        });
    } catch (error) {
      console.log("Error at /song/remove route:\n", error);
      res.sendStatus(500);
    }
  }
);

export default router;
