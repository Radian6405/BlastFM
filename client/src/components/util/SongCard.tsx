import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { artist, song } from "../../types/interfaces";
import { Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function SongCard({ song }: { song: song }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        display: "flex",
        width: "100%",
        color: "rgba(var(--text))",
        backgroundColor: "rgba(var(--light-background))",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        padding: 1,
      }}
    >
      <div className="ml-2 mr-4 flex size-10 items-center justify-center">
        <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
          <PlayArrowIcon sx={{ fontSize: 36 }} />
        </div>
      </div>
      <CardMedia
        sx={{ height: 60, width: 60 }}
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXx2xFk_wEb1hLQoDo4Ar3YbhosCPyOCfOgA&s"
        title={song.name}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="line-clamp-1 w-[40%] overflow-hidden px-4 text-2xl">
          {song.name}
        </div>
        <div className="text-text line-clamp-1 w-[30%] overflow-hidden text-lg">
          {song.artists.map((artist: artist, i: number) => {
            return (
              <span className="cursor-pointer hover:underline">
                {artist.name}
                {i !== song.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
        <div className="text-text w-[25%] pr-4 text-right">
          {Math.floor(song.playtime / 60)}:{song.playtime % 60}
        </div>
        <div className="flex w-[5%] items-center justify-center">
          <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
            <MoreVertIcon />
          </div>
        </div>
      </Box>
    </Card>
  );
}

export default SongCard;
