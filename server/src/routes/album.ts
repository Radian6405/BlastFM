import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
const router: Router = Router();

// to ADD album to starred albums
router.post(
  "/star",
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
      // checking if album exits
      const album = await pool.query("SELECT * FROM albums WHERE id = $1", [
        id,
      ]);
      if (Number(album.rowCount) === 0) {
        res.status(400).send({
          message: "Album does not exist",
        });
        return;
      }

      // checking if relation already exists
      const relation = await pool.query(
        "SELECT * FROM starred_albums WHERE user_id = $1 AND album_id = $2;",
        [req.user?.id, id]
      );
      if (Number(relation.rowCount) > 0) {
        res.status(400).send({
          message: "Album is already starred",
        });
        return;
      }

      const newRelation = await pool.query(
        "INSERT INTO starred_albums(user_id, album_id) VALUES ($1,$2);",
        [req.user?.id, id]
      );
      if (Number(newRelation.rowCount) > 0) res.sendStatus(201);
      else
        res.status(400).send({
          message: "Could not star the album",
        });
    } catch (error) {
      console.log("Error at POST /album/star route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to REMOVE album from starred albums
router.delete(
  "/unstar",
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
      // checking if album exits
      const album = await pool.query("SELECT * FROM albums WHERE id = $1", [
        id,
      ]);
      if (Number(album.rowCount) === 0) {
        res.status(400).send({
          message: "Album does not exist",
        });
        return;
      }

      // checking if relation already exists
      const relation = await pool.query(
        "SELECT * FROM starred_albums WHERE user_id = $1 AND album_id = $2;",
        [req.user?.id, id]
      );
      if (Number(relation.rowCount) === 0) {
        res.status(400).send({
          message: "Album is not in starred albums",
        });
        return;
      }

      const newRelation = await pool.query(
        "DELETE FROM starred_albums WHERE user_id = $1 AND album_id = $2;",
        [req.user?.id, id]
      );
      if (Number(newRelation.rowCount) > 0) res.sendStatus(200);
      else
        res.status(400).send({
          message: "Could not remove the album from starred albums",
        });
    } catch (error) {
      console.log("Error at POST /album/unstar route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to READ all starred albums of a user
router.get(
  "/starred",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    try {
      const albums = await pool.query(
        `SELECT a.id, a.name, a.description, a.cover_image, jsonb_build_object('id',ar.id,'name',ar.name) as artist 
            FROM starred_albums sa 
            INNER JOIN albums a ON a.id = sa.album_id 
            INNER JOIN artists ar ON ar.id = a.artist_id 
            WHERE sa.user_id = 3;`
      );

      res.status(200).send({ albums: albums.rows });
    } catch (error) {
      console.log("Error at POST /album/unstar route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to READ details of an album
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;

    try {
      const album = await pool.query(
        `SELECT a.id, a.name, a.description, a.cover_image, jsonb_build_object('id',ar.id,'name',ar.name) as artist from albums a 
        INNER JOIN artists ar ON ar.id = a.artist_id 
        WHERE a.id = $1;`,
        [id]
      );

      if (Number(album.rowCount) > 0) res.status(200).send(album.rows[0]);
      else
        res.status(400).send({
          message: "Album does not exist",
        });
    } catch (error) {
      console.log("Error at GET /album/details route:\n", error);
      res.sendStatus(500);
    }
  }
);
// to READ all songs in an album
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
      const album = await pool.query("SELECT * FROM albums WHERE id = $1;", [
        id,
      ]);
      if (Number(album.rowCount === 0)) {
        res.status(400).send({
          message: "Album does not exist",
        });
        return;
      }

      const albumSongs = await pool.query(
        `SELECT q.id, q.name, q.playtime, q.artists
          FROM albums_songs als
          INNER JOIN
          (
            SELECT s.id, s.name, s.playtime, jsonb_agg(jsonb_build_object('id',a.id,'name',a.name)) as artists
            FROM songs s
            INNER JOIN artists_songs ars ON ars.song_id = s.id
            INNER JOIN artists a ON a.id = ars.artist_id
            GROUP BY s.id,s.name,s.playtime
          ) q ON q.id = als.song_id
          WHERE als.album_id = $1;`,
        [id]
      );

      res.status(200).send({ songs: albumSongs.rows });
    } catch (error) {
      console.log("Error at GET /album/songlist route:\n", error);
      res.sendStatus(500);
    }
  }
);

export default router;
