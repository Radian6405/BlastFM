import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { playlist } from "../../util/interfaces";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import React, { ReactNode, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { Link } from "react-router-dom";

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
        image={playlist?.cover_image ?? ""} //TODO: add placeholders
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
        <div className="my-4 flex flex-col items-start justify-between px-4 text-text">
          <div className="line-clamp-2 w-full cursor-pointer overflow-hidden text-2xl font-bold text-text hover:underline">
            <Link to={"/playlist/" + String(playlist.id)}>{playlist.name}</Link>
          </div>
          <div className="overflow-hidden text-lg text-text/70">
            {playlist.track_count} tracks
          </div>
          <div className="text-md overflow-hidden text-text/50">
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

export function CreatePlaylistCard() {
  return (
    <>
      <Card
        sx={{
          maxWidth: 300,
          borderRadius: 2,
          backgroundColor: "rgba(var(--light-background))",
          cursor: "pointer",
        }}
      >
        <div className="flex size-[300px] items-center justify-center text-text">
          <CreatePlaylistDialog>
            <AddCircleIcon sx={{ fontSize: 96 }} />
          </CreatePlaylistDialog>
        </div>
      </Card>
    </>
  );
}

export function CreatePlaylistDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div onClick={handleClickOpen}>{children}</div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: 32,
            backgroundColor: "rgba(var(--background))",
            color: "rgba(var(--text))",
          }}
        >
          Create Playlists
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "rgba(var(--background))",
            color: "rgba(var(--text))",
          }}
        >
          <div className="flex items-center justify-center py-4">
            <div className="grid h-56 w-[35rem] grid-cols-5 grid-rows-4 gap-2 ">
              <div className="col-span-2 row-span-4 flex cursor-pointer flex-col items-center justify-center bg-light-background">
                <CreateIcon sx={{ fontSize: 64 }} />
                <div className="text-xl">Upload a photo</div>
              </div>
              <div className="col-span-3 row-span-1">
                <input
                  type="text"
                  className="h-full w-full bg-light-background px-2 text-xl"
                  placeholder="Enter a Name"
                />
              </div>
              <div className="col-span-3 row-span-3">
                <textarea
                  className="h-full w-full bg-light-background p-2 text-xl"
                  placeholder="Add an optional description"
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "rgba(var(--background))",
            color: "rgba(var(--text))",
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            autoFocus
            sx={{
              backgroundColor: "rgba(var(--primary))",
              borderRadius: 2,
              textTransform: "capitalize",
              color: "rgba(var(--text))",
            }}
          >
            <span className="mx-2 my-1 text-xl">Create</span>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default PlaylistCard;
