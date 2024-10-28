import { Button } from "@mui/material";

function Logout() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="text-9xl mb-20">Logged Out</div>
      <div className="text-3xl">Thank you for using BlastFM</div>
      <Button
        variant="outlined"
        disableElevation
        sx={{
          backgroundColor: "rgba(var(--primary))",
          borderRadius: 2,
          textTransform: "capitalize",
          color: "rgba(var(--text))",
        }}
      >
        <span className="mx-2 my-2 text-2xl">Sign in again</span>
      </Button>
    </div>
  );
}

export default Logout;
