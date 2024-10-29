import SyncIcon from "@mui/icons-material/Sync";

function LoadingCard() {
  return (
    <div className="flex animate-spin items-center justify-center p-20">
      <SyncIcon sx={{ fontSize: 128 }} />
    </div>
  );
}

export default LoadingCard;
