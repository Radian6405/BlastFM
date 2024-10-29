import { Button } from "@mui/material";
import { useCookies } from "react-cookie";

function ConnectButton() {
  const [cookie] = useCookies(["token", "access_token"]);

  async function InitiateSpotifyConnection() {
    try {
      const response = await fetch(
        "http://localhost:8000" + "/api/spotify-oauth/connect-url",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookie.token.token,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch redirect url");
      }
      console.log(data.url);
      window.location.href = data.url;
    } catch (error) {
      console.log("Error in ConnectSpotify Component:\n", error);
    }
  }
  return (
    <>
      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "green",
          borderRadius: 2,
          textTransform: "capitalize",
          color: "rgba(var(--text))",
        }}
        onClick={InitiateSpotifyConnection}
      >
        <span className="mx-1 my-2 text-2xl">Connect</span>
      </Button>
    </>
  );
}

export default ConnectButton;
