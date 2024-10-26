import pool from "../../../db";

// creates new artists
export async function createArtists(artistData: any) {
  let artistList: any = [];
  for (let i = 0; i < artistData.length; i++) {
    try {
      // checking if album already exists
      const doesArtistExist = await pool.query(
        "SELECT * FROM artists WHERE spotify_id = $1",
        [artistData[i].spotify_id]
      );
      if (Number(doesArtistExist.rowCount) > 0) continue;

      const newArtist = await pool.query(
        "INSERT INTO artists(name, spotify_id) VALUES($1, $2) RETURNING *;",
        [artistData[i].name, artistData[i].spotify_id]
      );
      artistList.push(newArtist.rows[0]);
      // console.log("Added new artist:", artistData[i].name);
    } catch (error) {
      console.log("Error creating artist:\n", error);
    }
  }
  return artistList;
}

// creates new songs and connects it to its artists
export async function createSongs(songData: any) {
  let songList: any = [];
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
          RETURNING *;`,
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

      songList.push(newSong.rows[0]);
      // console.log("Added new song:", songData[i].name);
    } catch (error) {
      console.log("Error creating song:\n", error);
    }
  }

  return songList;
}

// creates new albums and connects it to its artists and songs
export async function createAlbums(albumData: any) {
  let albumList: any = [];
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
          RETURNING *;`,
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
      // "INSERT INTO artists_songs(song_id,artist_id)
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

      albumList.push(newAlbum.rows[0]);
      // console.log("Added new album:", albumData[i].name);
    } catch (error) {
      console.log("Error creating albums:\n", error);
    }
  }
  return albumList;
}
