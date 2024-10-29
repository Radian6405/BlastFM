import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUserLikedSongs } from "../../util/getData";
import { song } from "../../util/interfaces";
import SongCard from "../util/SongCard";
import LoadingCard from "../util/LoadingCard";

function Songs() {
  const [songs, setSongs] = useState<song[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();

  async function setSongData() {
    const data: song[] | null | string = await getUserLikedSongs(cookie.token);
    if (typeof data !== "string" && data !== null) setSongs(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

  useEffect(() => {
    setSongData();
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
                return <SongCard key={i} song={song} />;
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Songs;
