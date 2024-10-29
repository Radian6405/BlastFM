import { Card, CardMedia, CardContent } from "@mui/material";
import { album, song } from "../../util/interfaces";
import { StarButton } from "../util/Buttons";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { getDetails, getSongs } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";
import SongCard from "../util/SongCard";

function AlbumPage() {
  const [albumDetails, setAlbumDetails] = useState<album | null>(null);
  const [songs, setSongs] = useState<song[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  async function setAlbumData() {
    if (typeof id !== "string") return;

    const data: album | null | string = await getDetails(
      cookie.token.token,
      id,
      "album"
    );
    if (typeof data !== "string" && data !== null) setAlbumDetails(data);
    else if (typeof data === "string") enqueueSnackbar(data);
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

  useEffect(() => {
    setAlbumData();
    setAlbumSongsData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-center gap-4 py-24">
        <div className="flex w-1/3 items-center justify-center">
          <Card elevation={0} sx={{ maxWidth: 450 }}>
            {albumDetails === null ? (
              <LoadingCard />
            ) : (
              <>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="350"
                  image={albumDetails?.cover_image ?? ""} //TODO: add placeholders
                />
                <CardContent
                  sx={{ backgroundColor: "rgba(var(--background))" }}
                >
                  <div className="text-start text-6xl font-bold text-text">
                    {albumDetails.name}
                  </div>
                  <div className="text-start text-2xl text-text">
                    {albumDetails.artist.name}
                  </div>
                  <div className="my-4 flex flex-row justify-start gap-4 px-2">
                    <StarButton tooltip="star" fill />
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          {songs === null ? (
            <LoadingCard />
          ) : (
            songs.map((song, i) => {
              return <SongCard key={i} song={song} />;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
