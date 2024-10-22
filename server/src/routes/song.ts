import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import { aucthenticateJWT } from "../util/authHelpers";
const router: Router = Router();

// to CREATE (ADD) songs to a playlist
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
      // checking if relation alreayd exists
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
      if (Number(newRelation.rowCount) > 0) res.sendStatus(201);
      else
        res.status(400).send({
          message: "Could not add song to the playlist",
        });
    } catch (error) {
      console.log("Error at /song/add route:\n", error);
      res.sendStatus(500);
    }
  }
);

// to DELETE (REMOVE) songs from a playlist
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
      // checking if relation alreayd exists
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
      if (Number(newRelation.rowCount) > 0) res.sendStatus(200);
      else
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
