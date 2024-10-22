import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
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
      const playlistSongs = await pool.query(
        `SELECT s.id, s.name, s.playtime, jsonb_agg(jsonb_build_object('id',a.id,'name',a.name)) as artists
        FROM playlists_songs ps 
        INNER JOIN songs s ON s.id = ps.song_id 
        INNER JOIN artists_songs ars ON ars.song_id = s.id 
        INNER JOIN artists a ON a.id = ars.artist_id 
        WHERE playlist_id = $1 
        GROUP BY s.id,s.name,s.playtime`,
        [id]
      );

      if (Number(playlist.rowCount) > 0) {
        // for private playlists checking for ownership
        if (playlist.rows[0].is_private) {
          if (req.user !== null && req.user.id === playlist.rows[0].owner_id)
            res.status(200).send({ songs: playlistSongs.rows });
          else
            res
              .status(401)
              .send({ message: "This playlist is set to private" });
        }
        // public playlists have no ownership check
        else res.status(200).send({ songs: playlistSongs.rows });
      } else {
        res.status(400).send({
          message: "Could not read playlist songs",
        });
      }
    } catch (error) {
      console.log("Error at GET /playlist/songlist route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to Read list of user's songs
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
      if (Number(playlists.rowCount) > 0)
        res.status(200).send({ playlists: playlists.rows });
      else
        res.status(400).send({
          message: "Could not read user's playlist data",
        });
    } catch (error) {
      console.log("Error at GET /playlist/user-playlists route:\n", error);
      res.sendStatus(500);
    }
  }
);

export default router;
