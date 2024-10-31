import { Card, CardMedia, Box } from "@mui/material";
import { artist } from "../../util/interfaces";
import { getAccessTokens, getFormatedTime } from "../../util/misc";
import { LikeButton, MoreButton, StarButton } from "./Buttons";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export function SongSearchCard({ song }: { song: any }) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [cookie, setCookie] = useCookies(["token", "access_token"]);

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
      ["access_token", access_token.access_token],
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
    setIsLiked(song.is_liked);
  }, []);
  return (
    <Card
      sx={{
        borderRadius: 2,
        display: "flex",
        width: "100%",
        color: "rgba(var(--text))",
        backgroundColor: "rgba(var(--light-background))",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        paddingY: 1,
        paddingX: 2,
      }}
    >
      {/* <div className="mr-2 flex size-10 items-center justify-center">
        <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
          <PlayArrowIcon sx={{ fontSize: 36 }} />
        </div>
      </div> */}
      <CardMedia
        sx={{ height: 60, width: 60 }}
        image={song?.cover_image ?? ""} //TODO: add placeholders
        title={song.name}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="line-clamp-1 w-[40%] cursor-pointer overflow-hidden px-4 text-2xl hover:underline ">
          {song.name}
        </div>
        <div className="line-clamp-1 w-[30%] overflow-hidden text-lg text-text">
          {song.artists.map((artist: artist, i: number) => {
            return (
              <span key={i}>
                {artist.name}
                {i !== song.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
        <div className="flex w-[30%] items-center justify-end gap-3 pr-4 text-text ">
          <LikeButton tooltip="like" fill={isLiked} onClick={swapLike} />
          <span className="text-right">{getFormatedTime(song.playtime)}</span>
          <MoreButton tooltip="More options" />
        </div>
      </Box>
    </Card>
  );
}

export function AlbumSearchCard({ album }: { album: any }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        display: "flex",
        width: "100%",
        color: "rgba(var(--text))",
        backgroundColor: "rgba(var(--light-background))",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        paddingY: 1,
        paddingX: 2,
      }}
    >
      {/* <div className="mr-2 flex size-10 items-center justify-center">
          <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
            <PlayArrowIcon sx={{ fontSize: 36 }} />
          </div>
        </div> */}
      <CardMedia
        sx={{ height: 60, width: 60 }}
        image={album?.cover_image ?? ""} //TODO: add placeholders
        title={album.name}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="line-clamp-1 w-[40%] cursor-pointer overflow-hidden px-4 text-2xl hover:underline ">
          {album.name}
        </div>
        <div className="line-clamp-1 w-[30%] overflow-hidden text-lg text-text">
          {album.artists.map((artist: artist, i: number) => {
            return (
              <span key={i}>
                {artist.name}
                {i !== album.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
        <div className="flex w-[30%] items-center justify-end gap-3 pr-4 text-text ">
          <StarButton tooltip="Star album" />
        </div>
      </Box>
    </Card>
  );
}