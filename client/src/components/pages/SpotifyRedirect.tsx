import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SpotifyRedirect() {
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState<string | null>(null);

  async function getTokensFromSpotify(code: string) {
    try {
      const response = await fetch(
        "http://localhost:8000/api/spotify-oauth/save-token",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // TODO: replace with JWT token stored in cookie
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzI5Nzc4OTAwLCJleHAiOjE3Mjk4NjUzMDB9.9VBIINYXYuVvhfOrILJc3iENBq0fVf-28xWsbjzWTbU",
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

      console.log(data);
      setMessage("success");
    } catch (error) {
      console.log("Error in Home Component:\n", error);
    }
  }

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (code === null) {
      setMessage("could not connect to spotify, try again");
      console.log(error);
      return;
    }

    // getting access and refresh tokens from auth code
    getTokensFromSpotify(code);
  }, []);

  return (
    <>
      <div>SpotifyRedirect</div>
      <div className="text-3xl">{message ?? ""}</div>
    </>
  );
}

export default SpotifyRedirect;
