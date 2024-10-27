import { useNavigate } from "react-router-dom";

function SyncButton() {
  const navigate = useNavigate();
  async function InitiateSpotifyConnection() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/spotify-oauth/connect-url",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzI5NzYzNDQwLCJleHAiOjE3Mjk4NDk4NDB9.edl5Wbs_i7mABTWG2D1s70sAKvwwDFwl-cfLMi-BVp8",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to fetch redirect url");
      }
      console.log(data.url);
      navigate(data.url);
    } catch (error) {
      console.log("Error in Home Component:\n", error);
    }
  }
  return (
    <>
      <div
        className="size-24 bg-red-500"
        onClick={InitiateSpotifyConnection}
      ></div>
    </>
  );
}

export default SyncButton;
