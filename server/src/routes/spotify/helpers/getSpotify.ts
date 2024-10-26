// gets and parses Saved albums of a user
export async function getUserSavedAlbums(access_token: string) {
  const query: string = new URLSearchParams([
    ["limit", "50"],
    ["market", "IN"],
  ]).toString();

  const response = await fetch(
    "https://api.spotify.com/v1/me/albums?" + query,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  if (!response.ok) return null;
  const data = await response.json();

  const parsedData = data.items.map((item: any) => {
    const total_playtime: number = item.album.tracks.items.reduce(
      (sum: any, current: any) => sum + current.duration_ms,
      0
    );

    return {
      spotify_id: item.album.id,
      name: item.album.name,
      track_count: item.album.total_tracks,
      artist: {
        spotify_id: item.album.artists[0].id,
        name: item.album.artists[0].name,
      },
      total_playtime: Math.round(total_playtime / 1000),
      songs: item.album.tracks.items.map((song: any) => {
        return {
          spotify_id: song.id,
          name: song.name,
          playtime: Math.round(song.duration_ms / 1000),
          artists: song.artists.map((artist: any) => {
            return {
              spotify_id: artist.id,
              name: artist.name,
            };
          }),
        };
      }),
    };
  });

  return parsedData;
}
