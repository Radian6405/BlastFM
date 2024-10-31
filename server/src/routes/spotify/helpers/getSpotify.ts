import { album, playlist, song } from "../../../types/interfaces";

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

  const parsedData: album[] = data.items.map((item: any) => {
    const total_playtime: number = item.album.tracks.items.reduce(
      (sum: number, current: any) => sum + current.duration_ms,
      0
    );

    return {
      spotify_id: item.album.id,
      name: item.album.name,
      track_count: item.album.total_tracks,
      cover_image: item.album.images[0].url,
      artist: {
        spotify_id: item.album.artists[0].id,
        name: item.album.artists[0].name,
      },
      total_playtime: Math.round(total_playtime / 1000),
      songs: item.album.tracks.items.map((song: any) => {
        return {
          spotify_id: song.id,
          name: song.name,
          cover_image: item.album.images[0].url,
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
export async function getUserPlaylists(
  access_token: string,
  user_spotify_id: string
) {
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

  let parsedData: playlist[] = [];

  // for each playlist gets the songs
  for (let i = 0; i < data.total; i++) {
    if (data.items[i].owner.id !== user_spotify_id) continue;

    // gets song data
    // its of any type as its not parsed yet
    let songlist: any = [];
    for (let j = 0; j < data.items[i].tracks.total; j += 50) {
      const song_query: string = new URLSearchParams([
        ["playlist_id", data.items[i].id],
        ["limit", "50"],
        ["market", "IN"],
        [
          "fields",
          "items(track(name,id,duration_ms,artists(id,name),album(total_tracks,id,name,artists(id,name),images))",
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

    let total_playtime: number = 0;
    songlist.forEach((song: any) => {
      total_playtime += song.track.duration_ms;
    });

    parsedData.push({
      spotify_id: data.items[i].id,
      name: data.items[i].name,
      track_count: data.items[i].tracks.total,
      is_private: !data.items[i].public,
      total_playtime: Math.round(total_playtime / 1000),
      cover_image: data.items[i].images[0].url,
      songs: songlist.map((item: any) => {
        return {
          artists: item.track.artists.map((i: any) => {
            return { name: i.name, spotify_id: i.id };
          }),
          playtime: Math.round(item.track.duration_ms / 1000),
          name: item.track.name,
          spotify_id: item.track.id,
          cover_image: item.track.album.images[0].url,
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

// gets and parses liked songs of a user
export async function getUserLikedSongs(access_token: string) {
  let total = 0;
  // its of any type as its not parsed yet
  let songlist: any = [];

  // gets song data
  for (let j = 0; j <= total; j += 50) {
    const song_query: string = new URLSearchParams([
      ["limit", "50"],
      ["market", "IN"],
      ["offset", `${j}`],
    ]).toString();
    const getSongs = await fetch(
      "https://api.spotify.com/v1/me/tracks?" + song_query,
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    // console.log(data.items[i].tracks.href + "?" + song_query);
    if (!getSongs.ok) return null;
    const songData = await getSongs.json();
    total = songData.total;
    songlist.push(...songData.items);
  }

  const parsedData: song[] = songlist.map((song: any) => {
    return {
      spotify_id: song.track.id,
      name: song.track.name,
      cover_image: song.track.album.images[0].url,
      playtime: Math.round(song.track.duration_ms / 1000),
      artists: song.track.artists.map((artist: any) => {
        return { name: artist.name, spotify_id: artist.id };
      }),
    };
  });

  return parsedData;
}

export async function getSong(access_token: string, song_id: string) {
  const song_query: string = new URLSearchParams([["market", "IN"]]).toString();
  const getSongData = await fetch(
    "https://api.spotify.com/v1/tracks/" + song_id + "?" + song_query,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
  // console.log(data.items[i].tracks.href + "?" + song_query);
  if (!getSongData.ok) return null;
  const song = await getSongData.json();

  return {
    spotify_id: song.id,
    name: song.name,
    cover_image: song.album.images[0].url,
    playtime: Math.round(song.duration_ms / 1000),
    artists: song.artists.map((artist: any) => {
      return { name: artist.name, spotify_id: artist.id };
    }),
  };
}

export async function getAlbum(access_token: string, album_id: string) {
  const query: string = new URLSearchParams([["market", "IN"]]).toString();
  const getAlbumData = await fetch(
    "https://api.spotify.com/v1/albums/" + album_id + "?" + query,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
  // console.log(data.items[i].tracks.href + "?" + song_query);
  if (!getAlbumData.ok) return null;
  const album = await getAlbumData.json();

  let total_playtime = 0;
  album.tracks.items.forEach((item: any) => {
    total_playtime += item.duration_ms;
  });

  return {
    spotify_id: album.id,
    name: album.name,
    track_count: album.tracks.total,
    cover_image: album.images[0].url,
    artist: {
      name: album.artists[0].name,
      spotify_id: album.artists[0].id,
    },
    total_playtime: Math.round(total_playtime / 1000),
    songs: album.tracks.items.map((item: any) => {
      return {
        spotify_id: item.id,
        name: item.name,
        cover_image: album.images[0].url,
        playtime: Math.round(item.duration_ms / 1000),
        artists: item.artists.map((artist: any) => {
          return { name: artist.name, spotify_id: artist.id };
        }),
      };
    }),
  };
}
