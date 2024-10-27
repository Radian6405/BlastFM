import { song } from "../../types/interfaces";
import SongCard from "../util/SongCard";

function Songs() {
  const testSong1: song = {
    id: 1442,
    name: "Wannabe",
    playtime: 217,
    artists: [
      {
        id: 1319,
        name: "why mona",
      },
    ],
  };
  const testSong2: song = {
    id: 1436,
    name: "death bed (coffee for your head)",
    playtime: 173,
    artists: [
      {
        id: 1314,
        name: "Powfu",
      },
      {
        id: 1314,
        name: "Powfu",
      },
      {
        id: 1315,
        name: "beabadoobee",
      },
    ],
  };
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">Liked Songs</div>
        <div className="flex flex-wrap gap-5">
          <SongCard song={testSong1} />
          <SongCard song={testSong2} />
          <SongCard song={testSong1} />
          <SongCard song={testSong2} />
          <SongCard song={testSong1} />
        </div>
      </div>
    </>
  );
}

export default Songs;
