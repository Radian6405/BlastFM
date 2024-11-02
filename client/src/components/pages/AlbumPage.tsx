import { Card, CardMedia, CardContent } from "@mui/material";
import { album, playlist, playlistCard, song } from "../../util/interfaces";
import { StarButton } from "../util/Buttons";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { getDetails, getSongs, getUserPlaylists } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";
import SongCard from "../util/SongCard";
import { getAccessTokens } from "../../util/misc";

function AlbumPage() {
  const [albumDetails, setAlbumDetails] = useState<album | null>(null);
  const [songs, setSongs] = useState<song[] | null>(null);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  const [cookie, setCookie] = useCookies(["token", "access_token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  async function setAlbumData() {
    if (typeof id !== "string") return;

    const data: album | null | string = await getDetails(
      cookie.token.token,
      id,
      "album"
    );
    if (typeof data !== "string" && data !== null) {
      setAlbumDetails(data);
      setIsStarred(data.is_starred);
    } else if (typeof data === "string") enqueueSnackbar(data);
  }
  async function setAlbumSongsData() {
    if (typeof id !== "string") return;
    const data: song[] | null | string = await getSongs(
      cookie.token.token,
      id,
      "album"
    );
    if (typeof data !== "string" && data !== null) setSongs(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

  async function swapStar() {
    if (cookie.token == null || albumDetails == null) return;

    // getting access token
    let access_token = cookie.access_token;
    if (access_token == null) {
      // if access token doesnt exist
      const access_token_data = await getAccessTokens(cookie.token.token);
      if (access_token_data === null || typeof access_token_data === "string") {
        enqueueSnackbar(access_token_data ?? "Could not get access tokens", {
          variant: "error",
        });
        return;
      }
      setCookie(
        "access_token",
        { access_token: access_token_data.access_token },
        { maxAge: access_token_data.expires_in }
      );

      access_token = { access_token: access_token_data.access_token };
    }

    // liking / disliking it
    const query = new URLSearchParams([
      ["spotify_id", albumDetails.spotify_id ?? ""],
    ]).toString();
    const response = await fetch(
      "http://localhost:8000" +
        "/api/album/star" +
        (isStarred ? "?" + query : ""),
      {
        method: isStarred ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: cookie.token.token,
        },

        body: !isStarred
          ? JSON.stringify({
              spotify_id: albumDetails.spotify_id,
              access_token: access_token.access_token,
            })
          : null,
      }
    );

    if (!response.ok) {
      const data = await response.json();
      enqueueSnackbar(
        data?.message ?? "Error with starring/unstarring " + albumDetails.name,
        { variant: "error" }
      );
      return;
    }

    enqueueSnackbar(
      isStarred
        ? `Removed ${albumDetails.name} from starred albums`
        : `Added ${albumDetails.name} to starred albums`,
      { variant: "success" }
    );
    setIsStarred(!isStarred);
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
    setAlbumData();
    setAlbumSongsData();
    setPlaylistNamesData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-center gap-16 py-24">
        <div className="flex items-center justify-center">
          <Card elevation={0} sx={{ maxWidth: 450 }}>
            {albumDetails === null ? (
              <LoadingCard />
            ) : (
              <>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="350"
                  image={
                    albumDetails?.cover_image ??
                    "../../../public/No_Image_Available.jpg"
                  }
                />
                <CardContent
                  sx={{ backgroundColor: "rgba(var(--background))" }}
                >
                  <div className="flex flex-col items-start justify-center gap-2">
                    <div className="text-start text-4xl font-bold text-text">
                      {albumDetails.name}
                    </div>
                    <div className="text-start text-2xl text-text">
                      {albumDetails.artist.name}
                    </div>
                    <div className="my-4 flex flex-row justify-start gap-4 px-2">
                      <StarButton
                        tooltip={isStarred ? "Unstar" : "Star"}
                        fill={isStarred}
                        onClick={swapStar}
                      />
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
        <div className="flex w-3/5 flex-col gap-4">
          {songs === null ? (
            <LoadingCard />
          ) : (
            songs.map((song, i) => {
              return <SongCard playlists={playlistNames} key={i} song={song} />;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
