import { useEffect, useState } from "react";
import { playlist } from "../../util/interfaces";
import PlaylistCard, { CreatePlaylistCard } from "../util/PlaylistCard";
import { getUserPlaylists } from "../../util/getData";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import LoadingCard from "../util/LoadingCard";

function Playlists() {
  const [playlists, setPlaylist] = useState<playlist[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();

  async function setPlaylistData() {
    const data: playlist[] | null | string = await getUserPlaylists(
      cookie.token.token
    );
    if (typeof data !== "string" && data !== null) setPlaylist(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

  useEffect(() => {
    setPlaylistData();
  }, []);
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">My Playlists</div>
        <div className="flex flex-wrap gap-5">
          {playlists === null ? (
            <LoadingCard />
          ) : (
            <>
              {playlists.map((playlist, i) => {
                return <PlaylistCard key={i} playlist={playlist} />;
              })}
              <CreatePlaylistCard />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Playlists;
