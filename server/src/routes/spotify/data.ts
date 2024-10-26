import { Router, Request, Response, NextFunction } from "express";
import { aucthenticateJWT } from "../../util/authHelpers";
import dotenv from "dotenv";
import pool from "../../db";
import { getUserPlaylists, getUserSavedAlbums } from "./helpers/getSpotify";
import { connectUsersToAlbums } from "./helpers/connect";
import {
  createArtists,
  createSongs,
  createAlbums,
  createPlaylists,
} from "./helpers/create";

const router: Router = Router();
dotenv.config({ path: "../../../../.env" });

router.post(
  "/sync/starred-albums",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { access_token } = req.body;
    if (access_token === null || access_token === undefined) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    // gets albums data
    const data = await getUserSavedAlbums(String(access_token));
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
    const songArtistssCreated = await createArtists(artistList);
    let songList: any[] = [];
    data.forEach((album: any) => {
      songList.push(...album.songs);
    });
    const songsCreated = await createSongs(songList);

    // Step 2: creating albums
    const albumArtistsCreated = await createArtists(
      data.map((album: any) => album.artist)
    );
    const albumsCreated = await createAlbums(data);

    // Step 3: connecting user with albums
    const userAlbumConnections = await connectUsersToAlbums(data, req.user);

    if (
      albumsCreated > 0 ||
      albumArtistsCreated + songArtistssCreated > 0 ||
      songsCreated > 0 ||
      userAlbumConnections > 0
    )
      res.status(201).send({
        albums_updated: albumsCreated,
        artists_updated: albumArtistsCreated + songArtistssCreated,
        song_updated: songsCreated,
        albums_connected: userAlbumConnections,
      });
    else res.sendStatus(200);
  }
);

router.post(
  "/sync/playlists",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { access_token } = req.body;
    if (access_token === null || access_token === undefined) {
      res.status(400).send({
        message: "Missing necessary details",
      });
      return;
    }

    // gets user spotify id
    const currentUser: any = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + String(access_token),
      },
    });
    if (!currentUser.ok) return;
    const userData = await currentUser.json();

    // gets albums data
    const data = await getUserPlaylists(String(access_token), userData.id);
    if (data === null) {
      res.sendStatus(400);
      return;
    }
    // res.send(data);

    // Step 1: creating songs
    let artist_list: any[] = [];
    let song_list: any[] = [];
    data.forEach((playlist: any) => {
      song_list.push(...playlist.songs);
    });
    song_list.forEach((song: any) => {
      artist_list.push(...song.artists);
    });
    const artistsCreated = await createArtists(artist_list);
    const songsCreated = await createSongs(song_list);

    // Step 2: creating playlist & connecting user with playlist
    const playlistsCreated = await createPlaylists(data, req.user.id);

    if (artistsCreated > 0 || songsCreated > 0 || playlistsCreated > 0)
      res.status(201).send({
        artists_updated: artistsCreated,
        song_updated: songsCreated,
        playlists_updated: playlistsCreated,
      });
    else res.sendStatus(200);
  }
);

export default router;
