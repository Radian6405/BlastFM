import AutorenewIcon from "@mui/icons-material/Autorenew";

function LoadingCard() {
  return (
    <div className="flex  animate-spin items-center justify-center p-20">
      <AutorenewIcon sx={{ fontSize: 128 }} />
    </div>
  );
}

export default LoadingCard;
