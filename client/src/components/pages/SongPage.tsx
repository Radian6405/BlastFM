import { Card, CardMedia, CardContent } from "@mui/material";
import { artist, song } from "../../util/interfaces";
import { LikeButton, PlusIconButton } from "../util/Buttons";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { getDetails } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";
import { getFormatedTime } from "../../util/misc";

function SongPage() {
  const [song, setSong] = useState<song | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  async function setSongData() {
    if (typeof id !== "string") return;

    const data: song | null | string = await getDetails(
      cookie.token,
      id,
      "song"
    );
    if (typeof data !== "string" && data !== null) setSong(data);
    else if (typeof data === "string") enqueueSnackbar(data);
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
                  image={song?.cover_image ?? ""} //TODO: add placeholders
                />
                <CardContent
                  sx={{ backgroundColor: "rgba(var(--background))" }}
                >
                  <div className="my-4 flex flex-row justify-start gap-4 px-2">
                    <LikeButton size={60} fontSize={36} tooltip="like" />
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
                    <span>
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
