import pool from "../../../db";

// creates new artists
export async function createArtists(artistData: any) {
  let artists: number = 0;
  for (let i = 0; i < artistData.length; i++) {
    try {
      // checking if album already exists
      const doesArtistExist = await pool.query(
        "SELECT * FROM artists WHERE spotify_id = $1",
        [artistData[i].spotify_id]
      );
      if (Number(doesArtistExist.rowCount) > 0) continue;

      const newArtist = await pool.query(
        "INSERT INTO artists(name, spotify_id) VALUES($1, $2);",
        [artistData[i].name, artistData[i].spotify_id]
      );
      artists++;
      // console.log("Added new artist:", artistData[i].name);
    } catch (error) {
      console.log("Error creating artist:\n", error);
    }
  }
  return artists;
}

// creates new songs and connects it to its artists
export async function createSongs(songData: any) {
  let songs: number = 0;
  for (let i = 0; i < songData.length; i++) {
    try {
      // checking if song already exists
      const doesSongExist = await pool.query(
        "SELECT * FROM songs WHERE spotify_id = $1",
        [songData[i].spotify_id]
      );
      if (Number(doesSongExist.rowCount) > 0) continue;

      // creating song
      const newSong = await pool.query(
        `INSERT INTO songs
          (name,playtime,spotify_id) 
          VALUES ($1,$2,$3) 
          RETURNING id;`,
        [songData[i].name, songData[i].playtime, songData[i].spotify_id]
      );

      // connecting this song to artist(s)

      //creates string like
      // "INSERT INTO artists_songs(song_id,artist_id)
      // VALUES ($1, (SELECT id FROM artists WHERE spotify_id = $2)), ($1, (SELECT id FROM artists WHERE spotify_id = $3)), ....."
      const values = songData[i].artists
        .map(
          (_: any, i: any) =>
            `($1, (SELECT id FROM artists WHERE spotify_id = $${i + 2})) `
        )
        .join(", ");

      const newRelations = await pool.query(
        `INSERT INTO artists_songs(song_id,artist_id) VALUES ${values}`,
        [
          newSong.rows[0].id,
          ...songData[i].artists.map((artist: any) => artist.spotify_id),
        ]
      );

      songs++;
      // console.log("Added new song:", songData[i].name);
    } catch (error) {
      console.log("Error creating song:\n", error);
    }
  }

  return songs++;
}

// creates new albums and connects it to its artists and songs
export async function createAlbums(albumData: any) {
  let albums: number = 0;
  for (let i = 0; i < albumData.length; i++) {
    try {
      // checking if album already exists
      const doesAlbumExist = await pool.query(
        "SELECT * FROM albums WHERE spotify_id = $1",
        [albumData[i].spotify_id]
      );
      if (Number(doesAlbumExist.rowCount) > 0) continue;

      const newAlbum = await pool.query(
        `INSERT INTO albums
          (name,total_playtime,track_count,artist_id,spotify_id) 
          VALUES ($1,$2,$3,(
            SELECT id 
            FROM artists 
            WHERE spotify_id = $4),$5)
            RETURNING id;`,
        [
          albumData[i].name,
          albumData[i].total_playtime,
          albumData[i].track_count,
          albumData[i].artist.spotify_id,
          albumData[i].spotify_id,
        ]
      );

      // connecting this album to song(s)

      //creates string like
      // "INSERT INTO albums_songs(album_id,song_id)
      // VALUES ($1, (SELECT id FROM songs WHERE spotify_id = $2)), ($1, (SELECT id FROM songs WHERE spotify_id = $3)), ....."
      const values = albumData[i].songs
        .map(
          (_: any, i: any) =>
            `($1, (SELECT id FROM songs WHERE spotify_id = $${i + 2})) `
        )
        .join(", ");

      const newRelations = await pool.query(
        `INSERT INTO albums_songs(album_id,song_id) VALUES ${values}`,
        [
          newAlbum.rows[0].id,
          ...albumData[i].songs.map((song: any) => song.spotify_id),
        ]
      );

      albums++;
      // console.log("Added new album:", albumData[i].name);
    } catch (error) {
      console.log("Error creating albums:\n", error);
    }
  }
  return albums;
}

// creates new playlists and connects it to its songs
export async function createPlaylists(playlistData: any, user_id: any) {
  let playlists: number = 0;
  for (let i = 0; i < playlistData.length; i++) {
    try {
      // checking if album already exists
      const doesAlbumExist = await pool.query(
        "SELECT * FROM playlists WHERE spotify_id = $1",
        [playlistData[i].spotify_id]
      );
      if (Number(doesAlbumExist.rowCount) > 0) continue;

      const newPlaylist = await pool.query(
        `INSERT INTO playlists
          (name,total_playtime,track_count,spotify_id,owner_id) 
          VALUES ($1,$2,$3,$4,$5)
          RETURNING id;`,
        [
          playlistData[i].name,
          playlistData[i].total_playtime,
          playlistData[i].track_count,
          playlistData[i].spotify_id,
          user_id,
        ]
      );

      // connecting this playlist to song(s)

      //creates string like
      // "INSERT INTO playlists_songs(playlist_id,song_id)
      // VALUES ($1, (SELECT id FROM songs WHERE spotify_id = $2)), ($1, (SELECT id FROM songs WHERE spotify_id = $3)), ....."
      const songs = playlistData[i].songs;
      const split_songs = [];
      const split_length = 10;

      for (let j = 0; j < songs.length; j += split_length)
        split_songs.push(songs.slice(j, j + split_length));

      for (let j = 0; j < split_songs.length; j += 1) {
        const values = split_songs[j]
          .map(
            (_: any, k: any) =>
              `($1, (SELECT id FROM songs WHERE spotify_id = $${k + 2}))`
          )
          .join(", ");

        const newRelations = await pool.query(
          `INSERT INTO playlists_songs(playlist_id,song_id) VALUES ${values}`,
          [
            newPlaylist.rows[0].id,
            ...split_songs[j].map((song: any) => song.spotify_id),
          ]
        );
      }

      playlists++;
      // console.log("Added new album:", playlistData[i].name);
    } catch (error) {
      console.log("Error creating playlists:\n", error);
    }
  }
  return playlists;
}
