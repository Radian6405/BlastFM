import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingCard from "../util/LoadingCard";
import { syncData } from "../../util/misc";

function SpotifyRedirect() {
  const [searchParams] = useSearchParams();
  const [cookie, setCookie] = useCookies(["token", "access_token"]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("Connecting to spotify...");

  async function getTokensFromSpotify(code: string) {
    try {
      const response = await fetch(
        "http://localhost:8000" + "/api/spotify-oauth/save-token",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: cookie.token.token,
          },
          body: JSON.stringify({
            auth_code: code,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch tokens");
      }
      setMessage("Connected Spotify, retrieving data...");
      setCookie(
        "access_token",
        { access_token: data.access_token },
        { maxAge: data.expires_in }
      );

      const isDataSynced = await syncData(
        data.access_token,
        cookie.token.token
      );
      if (!isDataSynced) {
        throw new Error(data?.message ?? "Failed to sync data");
      }
      navigate("/");
      enqueueSnackbar("Successfully Connected Spotify & Synced data", {
        variant: "success",
      });
    } catch (error) {
      console.log("Error in Home Component:\n", error);
    }
  }

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (code === null) {
      enqueueSnackbar("Could not connect to spotify, try again", {
        variant: "error",
      });
      console.log(error);
      return;
    }

    // getting access and refresh tokens from auth code
    getTokensFromSpotify(code);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <LoadingCard />
        <div className="text-5xl">{message}</div>
      </div>
    </>
  );
}

export default SpotifyRedirect;
