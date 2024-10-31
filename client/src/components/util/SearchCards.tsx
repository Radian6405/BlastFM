import { Card, CardMedia, Box } from "@mui/material";
import { artist } from "../../util/interfaces";
import { getFormatedTime } from "../../util/misc";
import { LikeButton, MoreButton, StarButton } from "./Buttons";

export function SongSearchCard({ song }: { song: any }) {
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
        paddingY: 1,
        paddingX: 2,
      }}
    >
      {/* <div className="mr-2 flex size-10 items-center justify-center">
        <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
          <PlayArrowIcon sx={{ fontSize: 36 }} />
        </div>
      </div> */}
      <CardMedia
        sx={{ height: 60, width: 60 }}
        image={song?.cover_image ?? ""} //TODO: add placeholders
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
        <div className="line-clamp-1 w-[40%] cursor-pointer overflow-hidden px-4 text-2xl hover:underline ">
          {song.name}
        </div>
        <div className="line-clamp-1 w-[30%] overflow-hidden text-lg text-text">
          {song.artists.map((artist: artist, i: number) => {
            return (
              <span key={i}>
                {artist.name}
                {i !== song.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
        <div className="flex w-[30%] items-center justify-end gap-3 pr-4 text-text ">
          <LikeButton tooltip="like" />
          <span className="text-right">{getFormatedTime(song.playtime)}</span>
          <MoreButton tooltip="More options" />
        </div>
      </Box>
    </Card>
  );
}

export function AlbumSearchCard({ album }: { album: any }) {
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
        paddingY: 1,
        paddingX: 2,
      }}
    >
      {/* <div className="mr-2 flex size-10 items-center justify-center">
          <div className="hover:bg-text/20 flex size-10 cursor-pointer items-center justify-center rounded-full">
            <PlayArrowIcon sx={{ fontSize: 36 }} />
          </div>
        </div> */}
      <CardMedia
        sx={{ height: 60, width: 60 }}
        image={album?.cover_image ?? ""} //TODO: add placeholders
        title={album.name}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="line-clamp-1 w-[40%] cursor-pointer overflow-hidden px-4 text-2xl hover:underline ">
          {album.name}
        </div>
        <div className="line-clamp-1 w-[30%] overflow-hidden text-lg text-text">
          {album.artists.map((artist: artist, i: number) => {
            return (
              <span key={i}>
                {artist.name}
                {i !== album.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
        <div className="flex w-[30%] items-center justify-end gap-3 pr-4 text-text ">
          <StarButton tooltip="Star album" />
        </div>
      </Box>
    </Card>
  );
}
