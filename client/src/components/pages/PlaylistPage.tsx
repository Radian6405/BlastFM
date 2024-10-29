// import { useParams } from "react-router-dom";

import { Card, CardMedia, CardContent } from "@mui/material";
import { playlist, song } from "../../util/interfaces";
import SongCard from "../util/SongCard";
import { PlusIconButton, TrashIconButton } from "../util/Buttons";

function PlaylistPage() {
  const playlist: playlist = {
    id: 19,
    name: "secondary",
    description: null,
    cover_image: null,
    owner_id: 1,
    total_playtime: 16594,
    track_count: 83,
    is_private: false,
    owner_username: "tester1",
  };
  const song1: song = {
    id: 1493,
    name: "Higher (feat. iann dior)",
    playtime: 204,
    artists: [
      {
        id: 1373,
        name: "Clean Bandit",
      },
      {
        id: 1374,
        name: "iann dior",
      },
    ],
  };
  //   const { id } = useParams();

  return (
    <>
      <div className="flex w-screen items-start justify-center gap-4 py-24">
        <div className="flex w-1/3 items-center justify-center">
          <Card elevation={0} sx={{ maxWidth: 450 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="350"
              image="https://media.tenor.com/f4PUj7wUIm4AAAAe/cat-tongue.png"
            />
            <CardContent sx={{ backgroundColor: "rgba(var(--background))" }}>
              <div className="text-start text-6xl font-bold text-text">
                {playlist.name}
              </div>
              <div className="text-start text-2xl text-text">
                {playlist.owner_username}
              </div>
              <div className="my-4 flex flex-row justify-start gap-4 px-2">
                <PlusIconButton tooltip="Add song" />
                <TrashIconButton tooltip={"Delete" + " playlist"} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          <SongCard song={song1} />
          <SongCard song={song1} />
          <SongCard song={song1} />
        </div>
      </div>
    </>
  );
}

export default PlaylistPage;
