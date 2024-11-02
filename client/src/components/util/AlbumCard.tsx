import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { album } from "../../util/interfaces";
import { Link } from "react-router-dom";

function AlbumCard({ album }: { album: album }) {
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
        image={album?.cover_image ?? "../../../public/No_Image_Available.jpg"}
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
        <div className="my-4 flex flex-col items-start justify-between px-4 text-text">
          <div className="line-clamp-2 w-full overflow-hidden text-2xl text-text hover:underline">
            <Link to={"/album/" + String(album.id)}>{album.name}</Link>
          </div>
          <div className="text-md overflow-hidden text-text/70">
            {album.track_count} tracks
          </div>
          <div className="text-md overflow-hidden text-text/50">
            {(album.total_playtime ?? 0) > 60
              ? Math.round((album.total_playtime ?? 0) / 60)
              : album.total_playtime}
            {(album.total_playtime ?? 0) > 60 ? " min" : " sec"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AlbumCard;
