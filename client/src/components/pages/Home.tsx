import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { user } from "../../util/interfaces";
import ConnectButton from "../util/ConnectButton";

function Home({ user }: { user: user | null }) {
  return (
    <>
      <div className="p-28">
        <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-x-12">
          {user === null ? (
            <PreReg />
          ) : !user.is_spotify_connected ? (
            <PreConnect />
          ) : (
            <div className="size-24 bg-blue-500"></div>
          )}
        </div>
      </div>
    </>
  );
}

function PreReg() {
  return (
    <>
      <div className="col-span-1 row-span-1 row-start-1 flex flex-col items-start justify-end gap-4">
        <div className="text-7xl font-bold">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Effortlessly
          </span>{" "}
          track
        </div>
        <div className="text-5xl">and organize your music</div>
      </div>
      <div className="col-span-1 row-span-1 row-start-2 flex flex-col items-start justify-center">
        <div className="text-wrap text-xl leading-8 ">
          Organize and track your playlists, albums, monitor listening trends,
          and discover new music. Personalize your experience and keep your
          favorite music perfectly in sync — all in one place.
        </div>
      </div>
      <div className="col-span-1 row-span-1 row-start-3 flex flex-row items-start justify-start gap-4 px-2 py-4">
        <Link to="/login">
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "rgba(var(--primary))",
              borderRadius: 2,
              textTransform: "capitalize",
              color: "rgba(var(--text))",
            }}
          >
            <span className="mx-1 my-2 text-2xl">Get Started</span>
          </Button>
        </Link>
        <Button
          variant="outlined"
          disableElevation
          sx={{
            borderColor: "rgba(var(--primary))",
            borderRadius: 2,
            textTransform: "capitalize",
            color: "rgba(var(--text))",
          }}
        >
          <span className="mx-2 my-2 text-2xl">Learn more</span>
        </Button>
      </div>
      <div className="col-span-1 col-start-2 row-span-3 flex flex-col items-center justify-center">
        <div className="h-[24rem] w-[32rem] bg-accent"></div>
      </div>
    </>
  );
}

function PreConnect() {
  return (
    <>
      <div className="col-span-1 col-start-1 row-span-3 flex flex-col items-center justify-center">
        <div className="h-[24rem] w-[32rem] bg-green-200"></div>
      </div>
      <div className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col items-start justify-end gap-4">
        <div className="text-7xl font-bold">
          Connect Your{" "}
          <span className="bg-gradient-to-r from-green-600 to-green-300 bg-clip-text text-transparent">
            Spotify
          </span>
        </div>
        <div className="text-5xl">and organize your music</div>
      </div>
      <div className="col-span-1 col-start-2 row-span-1 row-start-2 flex flex-col items-start justify-center">
        <div className="text-wrap text-xl leading-8 ">
          Organize and track your playlists, albums, monitor listening trends,
          and discover new music. Personalize your experience and keep your
          favorite music perfectly in sync — all in one place.
        </div>
      </div>
      <div className="col-span-1 col-start-2 row-span-1 row-start-3 flex flex-row items-start justify-start gap-4 px-2 py-4">
        <ConnectButton />
      </div>
    </>
  );
}

export default Home;
