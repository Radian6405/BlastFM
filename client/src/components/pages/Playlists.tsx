import { playlist } from "../../util/interfaces";
import PlaylistCard, { CreatePlaylistCard } from "../util/PlaylistCard";

function Playlists() {
  const testPlaylist1: playlist = {
    id: 17,
    name: "damn",
    description: null,
    cover_image: null,
    owner_id: 1,
    total_playtime: 43,
    track_count: 24,
    is_private: false,
    owner_username: "tester1",
  };
  const testPlaylist2: playlist = {
    id: 18,
    name: "Anime ",
    spotify_id: "3oPqmHtOh343GZnwapfNej",
    description: null,
    cover_image: null,
    owner_id: 1,
    total_playtime: 5089,
    track_count: 23,
    is_private: false,
  };
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 p-12">
        <div className="px-4 text-6xl">My Playlists</div>
        <div className="flex flex-wrap gap-5">
          <PlaylistCard playlist={testPlaylist1} />
          <PlaylistCard playlist={testPlaylist2} />
          <PlaylistCard playlist={testPlaylist1} />
          <PlaylistCard playlist={testPlaylist2} />
          <PlaylistCard playlist={testPlaylist1} />
          <CreatePlaylistCard />
        </div>
      </div>
    </>
  );
}

export default Playlists;
