export function getFormatedTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return String(min) + ":" + ((sec < 10 ? "0" : "") + String(sec));
}

export async function getAccessTokens(auth_token: string) {
  const response = await fetch(
    "http://localhost:8000" + "/api/spotify-oauth/access-token",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
    }
  );

  if (!response.ok) return null;
  const data = await response.json();

  return data;
}

export async function syncData(access_token: string, auth_token: string) {
  const albumResponse = await fetch(
    "http://localhost:8000/api/spotify-data/sync/starred-albums",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
      body: JSON.stringify({
        access_token: access_token,
      }),
    }
  );

  if (!albumResponse.ok) {
    console.log(albumResponse);
    return false;
  }
  const albumData = await albumResponse.json();

  const playlistResponse = await fetch(
    "http://localhost:8000/api/spotify-data/sync/playlists",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
      body: JSON.stringify({
        access_token: access_token,
      }),
    }
  );

  if (!playlistResponse.ok) {
    console.log(playlistResponse);
    return false;
  }
  const playlistData = await playlistResponse.json();

  const songResponse = await fetch(
    "http://localhost:8000/api/spotify-data/sync/liked-songs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth_token,
      },
      body: JSON.stringify({
        access_token: access_token,
      }),
    }
  );

  if (!songResponse.ok) {
    console.log(songResponse);
    return false;
  }
  const songData = await songResponse.json();

  console.log(albumData, playlistData, songData);
  return true;
}
