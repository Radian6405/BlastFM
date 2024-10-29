export async function getUserData(token: string) {
  const response = await fetch("http://localhost:8000" + "/api/auth/userdata", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data;
}

export async function getUserPlaylists(token: string) {
  const response = await fetch(
    "http://localhost:8000" + "/api/playlist/user-playlists",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data.playlists;
}

export async function getUserAlbums(token: string) {
  const response = await fetch("http://localhost:8000" + "/api/album/starred", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data.albums;
}

export async function getUserLikedSongs(token: string) {
  const response = await fetch(
    "http://localhost:8000" + "/api/song/liked-list",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data.songs;
}

export async function getDetails(
  token: string,
  id: string,
  type: "playlist" | "album" | "song"
) {
  const query: string = "?" + new URLSearchParams([["id", id]]).toString();
  const response = await fetch(
    "http://localhost:8000" + "/api/" + type + "/details" + query,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data;
}
export async function getSongs(
  token: string,
  id: string,
  type: "playlist" | "album"
) {
  const query: string = "?" + new URLSearchParams([["id", id]]).toString();
  const response = await fetch(
    "http://localhost:8000" + "/api/" + type + "/songlist" + query,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.log(data.message);
    return data?.message ?? null;
  }

  return data.songs;
}
