import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";
import { getAccessTokens } from "../../util/misc";
import { useSnackbar } from "notistack";
import { album, playlist, playlistCard, song } from "../../util/interfaces";
import LoadingCard from "../util/LoadingCard";
import { SongSearchCard, AlbumSearchCard } from "../util/SearchCards";
import { getUserPlaylists } from "../../util/getData";

function Search() {
  const [searchParams] = useSearchParams();
  const [cookie, setCookie] = useCookies(["token", "access_token"]);
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<song[] | album[] | null>(null);

  async function getSearchData() {
    if (cookie.token == null) return;

    // getting search data
    const query = searchParams.get("query");
    const option = searchParams.get("option");

    if (query == null || option == null) return;
    if (["Songs", "Albums"].indexOf(option) <= -1) return;

    // getting access token
    let access_token = cookie.access_token;
    if (access_token == null) {
      // if access token doesnt exist
      const access_token_data = await getAccessTokens(cookie.token.token);
      if (access_token_data === null || typeof access_token_data === "string") {
        enqueueSnackbar(access_token_data ?? "Could not get access tokens", {
          variant: "error",
        });
      } else {
        setCookie(
          "access_token",
          { access_token: access_token_data.access_token },
          { maxAge: access_token_data.expires_in }
        );

        access_token = { access_token: access_token_data.access_token };
      }
    }

    // calling spotify API
    const query_string: string = new URLSearchParams([
      ["q", query],
      ["type", option === "Songs" ? "track" : "album"],
      ["limit", "10"],
      ["market", "IN"],
    ]).toString();

    const response = await fetch(
      "https://api.spotify.com/v1/search?" + query_string,
      {
        headers: {
          Authorization: "Bearer " + access_token.access_token,
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      enqueueSnackbar("Could not search, Try again!", { variant: "error" });
      return;
    }
    const data = await response.json();
    setData(parseData(data, option));
  }

  // for playlist menus
  const [playlistNames, setPlaylistNames] = useState<playlistCard[] | null>(
    null
  );
  async function setPlaylistNamesData() {
    const data: playlist[] | null | string = await getUserPlaylists(
      cookie.token.token
    );
    if (typeof data !== "string" && data !== null) {
      setPlaylistNames(
        data.map((playlist: playlist): playlistCard => {
          return {
            name: playlist.name,
            id: playlist.id,
          };
        })
      );
    } else if (typeof data === "string") enqueueSnackbar(data);
  }

  useEffect(() => {
    getSearchData();
    setPlaylistNamesData();
  }, []);

  return (
    <div className="flex flex-col items-start justify-center gap-2 px-16">
      <div className="px-2 py-8 text-6xl">Search Results</div>
      {data == null ? (
        <LoadingCard />
      ) : searchParams.get("option") === "Songs" ? (
        data.map((song, i) => {
          return (
            <SongSearchCard key={i} song={song} playlists={playlistNames} />
          );
        })
      ) : (
        data.map((album, i) => {
          return <AlbumSearchCard key={i} album={album} />;
        })
      )}
    </div>
  );
}

function parseData(data: any, option: string) {
  if (option === "Songs") {
    return data.tracks.items.map((item: any) => {
      return {
        spotify_id: item.id,
        name: item.name,
        cover_image: item.album.images[0].url,
        playtime: Math.round(item.duration_ms / 1000),
        artists: item.artists.map((artist: any) => {
          return {
            name: artist.name,
            spotify_id: artist.id,
          };
        }),
      };
    });
  } else {
    return data.albums.items.map((item: any) => {
      return {
        spotify_id: item.id,
        name: item.name,
        track_count: item.total_tracks,
        cover_image: item.images[0].url,
        artists: item.artists.map((artist: any) => {
          return {
            spotify_id: artist.id,
            name: artist.name,
          };
        }),
      };
    });
  }
}

export default Search;
