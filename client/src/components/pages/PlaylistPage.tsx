// import { useParams } from "react-router-dom";

import { Card, CardMedia, CardContent } from "@mui/material";
import { playlist, playlistCard, song } from "../../util/interfaces";
import SongCard from "../util/SongCard";
import { PlusIconButton, TrashIconButton } from "../util/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import { getDetails, getSongs, getUserPlaylists } from "../../util/getData";
import LoadingCard from "../util/LoadingCard";

function PlaylistPage() {
  const [playlistDetails, setPlaylistDetails] = useState<playlist | null>(null);
  const [songs, setSongs] = useState<song[] | null>(null);

  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();

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

  async function deletePlaylist() {
    if (id == null) return;
    if (cookie.token == null) return;

    const response = await fetch(
      "http://localhost:8000" + "/api/playlist/delete?" + "id=" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: cookie.token.token,
        },
      }
    );
    if (!response.ok) {
      const data = await response.json();
      enqueueSnackbar(data.message ?? "Error deleting Playlist", {
        variant: "error",
      });
      return;
    }

    enqueueSnackbar("Sucessfully deleted Playlist", { variant: "success" });
    navigate("/playlists");
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
    setPlaylistData();
    setPlaylistSongsData();
    setPlaylistNamesData();
  }, []);

  return (
    <>
      <div className="flex items-start justify-center gap-16 py-24">
        <div className="flex items-center justify-center">
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
                  alt={playlistDetails.name}
                  sx={{ height: 300, width: 300 }}
                  image={
                    playlistDetails?.cover_image ??
                    "../../../public/No_Image_Available.jpg"
                  }
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
                    <TrashIconButton
                      tooltip={"Delete" + " playlist"}
                      onClick={deletePlaylist}
                    />
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
              return (
                <SongCard
                  playlists={playlistNames}
                  key={i}
                  song={song}
                  deleteFrom={playlistDetails}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default PlaylistPage;
