import { Card, CardMedia, CardContent } from "@mui/material";
import { album, song } from "../../types/interfaces";
import { StarButton } from "../util/Buttons";
import SongCard from "../util/SongCard";

function AlbumPage() {
  const album: album = {
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
      <div className="flex items-start justify-center gap-4 py-24">
        <div className="flex w-1/3 items-center justify-center">
          <Card elevation={0} sx={{ maxWidth: 450 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="350"
              image="https://media.tenor.com/f4PUj7wUIm4AAAAe/cat-tongue.png"
            />
            <CardContent sx={{ backgroundColor: "rgba(var(--background))" }}>
              <div className="text-text text-start text-6xl font-bold">
                {album.name}
              </div>
              <div className="text-text text-start text-2xl">
                {album.artist.name}
              </div>
              <div className="my-4 flex flex-row justify-start gap-4 px-2">
                <StarButton tooltip="star" fill />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          <SongCard song={song1} />
          <SongCard song={song1} />
        </div>
      </div>
    </>
  );
}

export default AlbumPage;
