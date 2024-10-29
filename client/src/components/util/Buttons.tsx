import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface IconButtonProps {
  tooltip?: string;
  fill?: boolean;
  size?: number;
  fontSize?: number;
}

export function PlusIconButton({ tooltip }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        color="inherit"
        sx={{
          backgroundColor: "rgba(var(--light-background))",
          width: 60,
          height: 60,
        }}
        aria-label="delete"
      >
        <AddIcon sx={{ fontSize: 48 }} />
      </IconButton>
    </Tooltip>
  );
}

export function TrashIconButton({ tooltip }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        color="inherit"
        sx={{
          backgroundColor: "rgba(var(--light-background))",
          width: 60,
          height: 60,
        }}
        aria-label="delete"
      >
        <DeleteIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </Tooltip>
  );
}

export function LikeButton({ tooltip, fill, size, fontSize }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      {fill ? (
        <IconButton
          color="inherit"
          sx={{
            backgroundColor: "rgba(var(--light-background))",
            width: size ?? 40,
            height: size ?? 40,
          }}
          aria-label="delete"
        >
          <FavoriteIcon sx={{ fontSize: fontSize ?? 24 }} />
        </IconButton>
      ) : (
        <IconButton
          color="inherit"
          sx={{
            backgroundColor: "rgba(var(--light-background))",
            width: size ?? 40,
            height: size ?? 40,
          }}
          aria-label="delete"
        >
          <FavoriteBorderIcon sx={{ fontSize: fontSize ?? 24 }} />
        </IconButton>
      )}
    </Tooltip>
  );
}
export function MoreButton({ tooltip }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        color="inherit"
        sx={{
          backgroundColor: "rgba(var(--light-background))",
          width: 40,
          height: 40,
        }}
        aria-label="delete"
      >
        <MoreVertIcon sx={{ fontSize: 24 }} />
      </IconButton>
    </Tooltip>
  );
}

export function StarButton({ tooltip, fill }: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      {fill ? (
        <IconButton
          color="inherit"
          sx={{
            backgroundColor: "rgba(var(--light-background))",
            width: 60,
            height: 60,
          }}
          aria-label="delete"
        >
          <StarIcon sx={{ fontSize: 36 }} />
        </IconButton>
      ) : (
        <IconButton
          color="inherit"
          sx={{
            backgroundColor: "rgba(var(--light-background))",
            width: 60,
            height: 60,
          }}
          aria-label="delete"
        >
          <StarBorderIcon sx={{ fontSize: 36 }} />
        </IconButton>
      )}
    </Tooltip>
  );
}