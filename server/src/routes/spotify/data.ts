import { Router, Request, Response, NextFunction } from "express";
import { aucthenticateJWT } from "../../util/authHelpers";
import dotenv from "dotenv";
import pool from "../../db";
import {
  getUserLikedSongs,
  getUserPlaylists,
  getUserSavedAlbums,
} from "./helpers/getSpotify";
import { connectUsersToAlbums, connectUsersToSongs } from "./helpers/connect";
import {
  createArtists,
  createSongs,
  createAlbums,
  createPlaylists,
} from "./helpers/create";
import { album, artist, playlist, song } from "../../types/interfaces";

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
    const data: album[] | null = await getUserSavedAlbums(String(access_token));
    if (data === null) {
      res.sendStatus(400);
      return;
    }

    // Step 1: creating songs
    let artistList: artist[] = [];
    data.forEach((album: album) => {
      album?.songs?.forEach((song: song) => {
        artistList.push(...song.artists);
      });
    });
    const songArtistssCreated = await createArtists(artistList);
    let songList: song[] = [];
    data.forEach((album: album) => {
      songList.push(...(album?.songs ?? []));
    });
    const songsCreated = await createSongs(songList);

    // Step 2: creating albums
    const albumArtistsCreated = await createArtists(
      data.map((album: album) => album.artist)
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
    const currentUser = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + String(access_token),
      },
    });
    if (!currentUser.ok) return;
    const userData = await currentUser.json();

    // gets albums data
    const data: playlist[] | null = await getUserPlaylists(
      String(access_token),
      userData.id
    );
    if (data === null) {
      res.sendStatus(400);
      return;
    }
    // res.send(data);

    // Step 1: creating songs
    let artist_list: artist[] = [];
    let song_list: song[] = [];
    data.forEach((playlist: playlist) => {
      song_list.push(...(playlist?.songs ?? []));
    });
    song_list.forEach((song: song) => {
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

router.post(
  "/sync/liked-songs",
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

    // gets songs data
    const data: song[] | null = await getUserLikedSongs(access_token);
    if (data === null) {
      res.sendStatus(400);
      return;
    }
    // res.send(data);

    // Step 1: creating artists
    let artist_list: artist[] = [];
    data.forEach((song: song) => {
      artist_list.push(...song.artists);
    });
    const artistsCreated = await createArtists(artist_list);

    // Step 2: creating songs
    const songsCreated = await createSongs(data);

    // Step 3: connecting songs to user
    const userAlbumConnections = await connectUsersToSongs(data, req.user);

    if (artistsCreated > 0 || songsCreated > 0 || userAlbumConnections > 0)
      res.status(201).send({
        artists_updated: artistsCreated,
        songs_updated: songsCreated,
        songs_connected: userAlbumConnections,
      });
    else res.sendStatus(200);
  }
);

export default router;
