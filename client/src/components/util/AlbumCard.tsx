import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { album } from "../../types/interfaces";

function AlbumCard({ album }: { album: album }) {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 2,
        cursor: "pointer",
        backgroundColor: "rgba(var(--light-background))",
      }}
    >
      <CardMedia
        sx={{ height: 300, width: 300 }}
        image="https://media.tenor.com/hVTGSfNmQhcAAAAM/ivehadituptoherewithyou-think-fast.gif"
        title={album.name}
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
          <div className="text-text w-full overflow-hidden text-2xl">
            {album.name}
          </div>
          <div className="text-text/70 text-md overflow-hidden">
            {album.track_count} tracks
          </div>
          <div className="text-text/50 text-md overflow-hidden">
            {album.total_playtime > 60
              ? Math.round(album.total_playtime / 60)
              : album.total_playtime}
            {album.total_playtime > 60 ? " min" : " sec"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AlbumCard;
