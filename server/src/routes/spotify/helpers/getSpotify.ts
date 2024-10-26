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

// gets and parses Saved playlists of a user
export async function getUserPlaylists(access_token: string, user_id: string) {
  const query: string = new URLSearchParams([["limit", "50"]]).toString();

  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists?" + query,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  if (!response.ok) return null;
  const data = await response.json();

  let parsedData: any[] = [];

  for (let i = 0; i < data.total; i++) {
    const total_playtime: number = 0;
    if (data.items[i].owner.id !== user_id) continue;

    // gets song data
    let songlist: any = [];
    for (let j = 0; j < data.items[i].tracks.total; j += 50) {
      const song_query: string = new URLSearchParams([
        ["playlist_id", data.items[i].id],
        ["limit", "50"],
        ["market", "IN"],
        [
          "fields",
          "items(track(name,id,duration_ms,artists(id,name),album(total_tracks,id,name,artists(id,name)))",
        ],
        ["offset", `${j}`],
      ]).toString();
      const getSongs = await fetch(
        data.items[i].tracks.href + "?" + song_query,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
      // console.log(data.items[i].tracks.href + "?" + song_query);
      if (!getSongs.ok) continue;
      const songData = await getSongs.json();
      songlist.push(...songData.items);
    }

    parsedData.push({
      spotify_id: data.items[i].id,
      name: data.items[i].name,
      track_count: data.items[i].tracks.total,
      is_private: !data.items[i].public,
      total_playtime: total_playtime,
      songs: songlist.map((item: any) => {
        return {
          artists: item.track.artists.map((i: any) => {
            return { name: i.name, spotify_id: i.id };
          }),
          playtime: Math.round(item.track.duration_ms / 1000),
          name: item.track.name,
          spotify_id: item.track.id,
          // album: {
          //   artist: {
          //     name: item.track.album.artists[0].name,
          //     spotify_id: item.track.album.artists[0].name,
          //   },
          //   name: item.track.album.name,
          //   track_count: item.track.album.total_tracks,
          //   spotify_id: item.track.album.id,
          // },
        };
      }),
    });
  }

  return parsedData;
}
