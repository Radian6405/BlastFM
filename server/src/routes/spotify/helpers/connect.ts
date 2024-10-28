import pool from "../../../db";
import { album, song } from "../../../types/interfaces";

// connects users to their albums
export async function connectUsersToAlbums(
  albumData: album[],
  user: Express.Request["user"]
) {
  let relations: number = 0;

  for (let i = 0; i < albumData.length; i++) {
    try {
      // if album is already in user's library
      const relation = await pool.query(
        "SELECT * FROM starred_albums WHERE user_id = $1 AND album_id = (SELECT id FROM albums WHERE spotify_id = $2)",
        [user?.id, albumData[i].spotify_id]
      );

      if (Number(relation.rowCount) > 0) continue;

      // creating relation
      const newRelation = await pool.query(
        "INSERT INTO starred_albums(user_id,album_id) VALUES ($1,(SELECT id FROM albums WHERE spotify_id = $2))",
        [user?.id, albumData[i].spotify_id]
      );

      relations++;
    } catch (error) {
      console.log("Error creating users-albums relation:\n", error);
    }
  }

  return relations;
}

// connects users to their albums
export async function connectUsersToSongs(
  songData: song[],
  user: Express.Request["user"]
) {
  let relations: number = 0;

  for (let i = 0; i < songData.length; i++) {
    try {
      // if song is already in user's liked list
      const relation = await pool.query(
        "SELECT * FROM liked_songs WHERE user_id = $1 AND song_id = (SELECT id FROM songs WHERE spotify_id = $2)",
        [user?.id, songData[i].spotify_id]
      );

      if (Number(relation.rowCount) > 0) continue;

      // creating relation
      const newRelation = await pool.query(
        "INSERT INTO liked_songs(user_id,song_id) VALUES ($1,(SELECT id FROM songs WHERE spotify_id = $2))",
        [user?.id, songData[i].spotify_id]
      );

      relations++;
    } catch (error) {
      console.log("Error creating users-songs relation:\n", error);
    }
  }

  return relations;
}
