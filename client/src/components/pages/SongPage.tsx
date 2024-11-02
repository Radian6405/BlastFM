import { Card, CardMedia, CardContent } from "@mui/material";
import { artist, song } from "../../util/interfaces";
import { LikeButton, PlusIconButton } from "../util/Buttons";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { getDetails } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";
import { getAccessTokens, getFormatedTime } from "../../util/misc";

function SongPage() {
  const [song, setSong] = useState<song | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [cookie, setCookie] = useCookies(["token", "access_token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  async function setSongData() {
    if (typeof id !== "string") return;

    const data: song | null | string = await getDetails(
      cookie?.token?.token,
      id,
      "song"
    );
    if (typeof data !== "string" && data !== null) {
      setSong(data);
      setIsLiked(data.is_liked);
    } else if (typeof data === "string") enqueueSnackbar(data);
  }

  async function swapLike() {
    if (cookie.token == null || song == null) return;

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
      ["spotify_id", song.spotify_id ?? ""],
    ]).toString();
    const response = await fetch(
      "http://localhost:8000" + "/api/song/like" + (isLiked ? "?" + query : ""),
      {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: cookie.token.token,
        },

        body: !isLiked
          ? JSON.stringify({
              spotify_id: song.spotify_id,
              access_token: access_token.access_token,
            })
          : null,
      }
    );

    if (!response.ok) {
      const data = await response.json();
      enqueueSnackbar(
        data?.message ?? "Error with liking/disliking " + song.name,
        { variant: "error" }
      );
      return;
    }

    enqueueSnackbar(
      isLiked
        ? `Removed ${song.name} from liked songs`
        : `Added ${song.name} to liked songs`,
      { variant: "success" }
    );
    setIsLiked(!isLiked);
  }

  useEffect(() => {
    setSongData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-center gap-4 py-24">
        {song === null ? (
          <LoadingCard />
        ) : (
          <>
            <div className="flex w-1/3 items-center justify-center">
              <Card elevation={0} sx={{ maxWidth: 450 }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="350"
                  image={song?.cover_image ?? "/No_Image_Available.jpgg"}
                />
                <CardContent
                  sx={{ backgroundColor: "rgba(var(--background))" }}
                >
                  <div className="my-4 flex flex-row justify-start gap-4 px-2">
                    <LikeButton
                      size={60}
                      fontSize={36}
                      tooltip="like"
                      fill={isLiked}
                      onClick={swapLike}
                    />
                    <PlusIconButton tooltip="add to playlist" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex w-1/2 flex-col gap-8">
              <div className="text-start text-7xl font-bold text-text">
                {song.name}
              </div>
              <div className="text-start text-3xl text-text">
                {song.artists.map((artist: artist, i) => {
                  return (
                    <span key={i}>
                      {artist.name}
                      {i !== song.artists.length - 1 && ", "}
                    </span>
                  );
                })}
              </div>
              <div className="text-start text-5xl text-text">
                {getFormatedTime(song.playtime)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SongPage;
