import { album } from "../../types/interfaces";
import AlbumCard from "../util/AlbumCard";

function Albums() {
  const testAlbum1: album = {
    id: 26,
    name: "Sick Boy",
    description: null,
    cover_image: null,
    total_playtime: 1970,
    track_count: 10,
    artist: {
      id: 1302,
      name: "The Chainsmokers",
    },
  };
  const testAlbum2: album = {
    id: 29,
    name: "Elsewhere",
    description: null,
    cover_image: null,
    total_playtime: 2891,
    track_count: 16,
    artist: {
      id: 1459,
      name: "Set It Off",
    },
  };
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">Saved Albums</div>
        <div className="flex flex-wrap gap-5">
          <AlbumCard album={testAlbum1} />
          <AlbumCard album={testAlbum2} />
          <AlbumCard album={testAlbum1} />
          <AlbumCard album={testAlbum2} />
          <AlbumCard album={testAlbum1} />
        </div>
      </div>
    </>
  );
}

export default Albums;
