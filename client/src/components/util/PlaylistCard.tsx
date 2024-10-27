import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { playlist } from "../../types/interfaces";

function PlaylistCard({ playlist }: { playlist: playlist }) {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 2,
        backgroundColor: "rgba(var(--light-background))",
      }}
    >
      <CardMedia
        sx={{ height: 300, width: 300 }}
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx_i7mL7PZuJ7cFSnOr0zEmL0kDdkUgM26eA&s"
        title={playlist.name}
      />
      <CardContent
        sx={{
          padding: 0,
          "&:last-child": {
            paddingBottom: 0,
          },
        }}
      >
        <div className="text-text my-4 flex flex-col items-start justify-between px-4">
          <div className="text-text w-full overflow-hidden text-2xl font-bold">
            {playlist.name}
          </div>
          <div className="text-text/70 overflow-hidden text-lg">
            {playlist.track_count} tracks
          </div>
          <div className="text-text/50 text-md overflow-hidden">
            {playlist.total_playtime > 60
              ? Math.round(playlist.total_playtime / 60)
              : playlist.total_playtime}
            {playlist.total_playtime > 60 ? " min" : " sec"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlaylistCard;
