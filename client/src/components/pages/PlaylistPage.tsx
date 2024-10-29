// import { useParams } from "react-router-dom";

import { Card, CardMedia, CardContent } from "@mui/material";
import { playlist, song } from "../../util/interfaces";
import SongCard from "../util/SongCard";
import { PlusIconButton, TrashIconButton } from "../util/Buttons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { getDetails, getSongs } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";

function PlaylistPage() {
  const [playlistDetails, setPlaylistDetails] = useState<playlist | null>(null);
  const [songs, setSongs] = useState<song[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  async function setPlaylistData() {
    if (typeof id !== "string") return;
    const data: playlist | null | string = await getDetails(
      cookie.token.token,
      id,
      "playlist"
    );
    if (typeof data !== "string" && data !== null) setPlaylistDetails(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }
  async function setPlaylistSongsData() {
    if (typeof id !== "string") return;
    const data: song[] | null | string = await getSongs(
      cookie.token.token,
      id,
      "playlist"
    );
    if (typeof data !== "string" && data !== null) setSongs(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

  useEffect(() => {
    setPlaylistData();
    setPlaylistSongsData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-center gap-4 py-24">
        <div className="flex w-1/3 items-center justify-center">
          <Card
            elevation={0}
            sx={{
              maxWidth: 450,
              backgroundColor: "rgba(var(--light-background))",
            }}
          >
            {playlistDetails === null ? (
              <LoadingCard />
            ) : (
              <>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="350"
                  image={playlistDetails?.cover_image ?? ""} //TODO: add placeholders
                />
                <CardContent
                  sx={{ backgroundColor: "rgba(var(--background))" }}
                >
                  <div className="text-start text-6xl font-bold text-text">
                    {playlistDetails.name}
                  </div>
                  <div className="text-start text-2xl text-text">
                    {playlistDetails.owner_username}
                  </div>
                  <div className="my-4 flex flex-row justify-start gap-4 px-2">
                    <PlusIconButton tooltip="Add song" />
                    <TrashIconButton tooltip={"Delete" + " playlist"} />
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

export default PlaylistPage;
