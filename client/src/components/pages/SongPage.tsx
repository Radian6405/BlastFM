import { Card, CardMedia, CardContent } from "@mui/material";
import { artist, song } from "../../util/interfaces";
import { LikeButton, PlusIconButton } from "../util/Buttons";

function SongPage() {
  const song: song = {
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
              <div className="my-4 flex flex-row justify-start gap-4 px-2">
                <LikeButton size={60} fontSize={36} tooltip="like" />
                <PlusIconButton tooltip="add to playlist" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-1/2 flex-col gap-8">
          <div className="text-start text-7xl font-bold text-text">
            {song.name}
          </div>
          <div className="text-start text-3xl text-text">
            {song.artists.map((artist: artist, i) => {
              return (
                <span>
                  {artist.name}
                  {i !== song.artists.length - 1 && ", "}
                </span>
              );
            })}
          </div>
          <div className="text-start text-5xl text-text">
            {Math.floor(song.playtime / 60)}:{song.playtime % 60}
          </div>
        </div>
      </div>
    </>
  );
}

export default SongPage;
