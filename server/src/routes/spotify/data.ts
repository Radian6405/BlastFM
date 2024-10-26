import { Router, Request, Response, NextFunction } from "express";
import { aucthenticateJWT } from "../../util/authHelpers";
import dotenv from "dotenv";
import pool from "../../db";
import { getUserSavedAlbums } from "./helpers/getSpotify";
import { connectUsersToAlbums } from "./helpers/connect";
import { createArtists, createSongs, createAlbums } from "./helpers/create";

const router: Router = Router();
dotenv.config({ path: "../../../../.env" });

router.get(
  "/sync/starred-albums",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    // gets albums data
    const data = await getUserSavedAlbums(String(req.query.access_token));
    if (data === null) {
      res.sendStatus(400);
      return;
    }

    // Step 1: creating songs
    let artistList: any[] = [];
    data.forEach((album: any) => {
      album.songs.forEach((song: any) => {
        artistList.push(...song.artists);
      });
    });
    const songArtistsUpdates = await createArtists(artistList);
    let songList: any[] = [];
    data.forEach((album: any) => {
      songList.push(...album.songs);
    });
    const songUpdates = await createSongs(songList);

    // Step 2: creating albums
    const albumArtistUpdates = await createArtists(
      data.map((album: any) => album.artist)
    );
    const albumUpdates = await createAlbums(data);

    // Step 3: connecting user with albums
    const addedAlbumsUpdates = await connectUsersToAlbums(data, req.user);

    if (
      albumUpdates.length > 0 ||
      albumArtistUpdates.length + songArtistsUpdates.length > 0 ||
      songUpdates.length > 0 ||
      addedAlbumsUpdates.length
    )
      res.status(201).send({
        albums_updated: albumUpdates.length,
        artists_updated: albumArtistUpdates.length + songArtistsUpdates.length,
        song_updates: songUpdates.length,
        albums_added: addedAlbumsUpdates.length,
      });
    else res.sendStatus(200);
  }
);

export default router;
