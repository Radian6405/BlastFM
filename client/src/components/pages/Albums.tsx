import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getUserAlbums } from "../../util/getData";
import { album } from "../../util/interfaces";
import { useSnackbar } from "notistack";
import LoadingCard from "../util/LoadingCard";
import AlbumCard from "../util/AlbumCard";

function Albums() {
  const [albums, setAlbums] = useState<album[] | null>(null);
  const [cookie] = useCookies(["token"]);
  const { enqueueSnackbar } = useSnackbar();

  async function setAlbumData() {
    const data: album[] | null | string = await getUserAlbums(cookie.token.token);
    if (typeof data !== "string" && data !== null) setAlbums(data);
    else if (typeof data === "string") enqueueSnackbar(data);
  }

  useEffect(() => {
    setAlbumData();
  }, []);
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">Saved Albums</div>
        <div className="flex flex-wrap gap-5">
          {albums === null ? (
            <LoadingCard />
          ) : (
            <>
              {albums.map((album, i) => {
                return <AlbumCard key={i} album={album} />;
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Albums;
