import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { playlist } from "../../types/interfaces";
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

function PlaylistCard({ playlist }: { playlist: playlist }) {
  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: 2,
        backgroundColor: "rgba(var(--light-background))",
        cursor: "pointer",
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
        <div className="text-text flex size-[300px] items-center justify-center">
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
              <div className="bg-light-background col-span-2 row-span-4 flex cursor-pointer flex-col items-center justify-center">
                <CreateIcon sx={{ fontSize: 64 }} />
                <div className="text-xl">Upload a photo</div>
              </div>
              <div className="col-span-3 row-span-1">
                <input
                  type="text"
                  className="bg-light-background h-full w-full px-2 text-xl"
                  placeholder="Enter a Name"
                />
              </div>
              <div className="col-span-3 row-span-3">
                <textarea
                  className="bg-light-background h-full w-full p-2 text-xl"
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
