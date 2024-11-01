import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUserLikedSongs, getUserPlaylists } from "../../util/getData";
import { playlist, playlistCard, song } from "../../util/interfaces";
import SongCard from "../util/SongCard";
import LoadingCard from "../util/LoadingCard";

function Songs() {
  const [songs, setSongs] = useState<song[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();

  async function setSongData() {
    const data: song[] | null | string = await getUserLikedSongs(
      cookie.token.token
    );
    if (typeof data !== "string" && data !== null) setSongs(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

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
    setSongData();
    setPlaylistNamesData();
  }, []);
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">Liked Songs</div>
        <div className="flex flex-wrap gap-5">
          {songs === null ? (
            <LoadingCard />
          ) : (
            <>
              {songs.map((song, i) => {
                return (
                  <SongCard key={i} song={song} playlists={playlistNames} />
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Songs;
