import pool from "../../../db";

// connects users to their albums
export async function connectUsersToAlbums(albumData: any, user: any) {
  let relations: number = 0;

  for (let i = 0; i < albumData.length; i++) {
    try {
      // if album is already in user's library
      const relation = await pool.query(
        "SELECT * FROM starred_albums WHERE user_id = $1 AND album_id = (SELECT id FROM albums WHERE spotify_id = $2)",
        [user.id, albumData[i].spotify_id]
      );

      if (Number(relation.rowCount) > 0) continue;

      // creating relation
      const newRelation = await pool.query(
        "INSERT INTO starred_albums(user_id,album_id) VALUES ($1,(SELECT id FROM albums WHERE spotify_id = $2))",
        [user.id, albumData[i].spotify_id]
      );

      relations++;
    } catch (error) {
      console.log("Error creating users-albums relation:\n", error);
    }
  }

  return relations;
}
