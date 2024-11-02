import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { user } from "../../util/interfaces";
import ConnectButton from "../util/ConnectButton";
import { useState } from "react";

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
            <Discover />
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
        <img src={"/Illustration_1.jpg"} className="h-[28rem] w-[40rem]" />
        <div className="text-md text-text/70">
          asset from{" "}
          <a
            href="http://www.freepik.com/"
            className="text-blue-500 hover:text-blue-300"
          >
            freepik.com
          </a>
        </div>
      </div>
    </>
  );
}

function PreConnect() {
  return (
    <>
      <div className="col-span-1 col-start-1 row-span-3 flex flex-col items-center justify-center">
        <img src={"/Spotify.png"} className=" w-[40rem]" />
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

function Discover() {
  const [query, setQuery] = useState<string>("");
  const [option, setOption] = useState<string | null>(null);

  const navigate = useNavigate();

  function search() {
    if (query !== "" && option !== null)
      navigate("/search?" + "query=" + query + "&option=" + option);
  }

  return (
    <>
      <div className="col-span-2 row-span-1">
        <div className="p-4 text-center text-8xl font-bold">
          <span className="bg-gradient-to-t from-primary to-accent bg-clip-text text-transparent">
            Discover new music
          </span>
        </div>
      </div>
      <div className="col-span-2 row-span-1 flex flex-row items-center justify-center">
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          sx={{
            width: "50%",
            fontSize: 64,
            backgroundColor: "rgba(var(--light-background))",
          }}
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          required
          size="medium"
        />
        <Autocomplete
          options={["Songs", "Albums"]}
          getOptionLabel={(option: any) => option}
          sx={{ width: "20%", color: "rgba(var(--text))" }}
          value={option}
          onChange={(_event: any, newValue: string | null) => {
            setOption(newValue);
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              sx={{
                color: "rgba(var(--text))",
                backgroundColor: "rgba(var(--light-background))",
              }}
              label="Type"
              required
            />
          )}
          PaperComponent={({ children }) => (
            <Paper style={{ background: "rgba(var(--light-background))" }}>
              {children}
            </Paper>
          )}
        />
      </div>
      <div className="col-span-2 row-span-1 flex flex-row items-center justify-center">
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "rgba(var(--primary))",
            borderRadius: 2,
            textTransform: "capitalize",
            color: "rgba(var(--text))",
          }}
          onClick={search}
        >
          <span className="mx-1 my-2 text-2xl">Search</span>
        </Button>
      </div>
    </>
  );
}

export default Home;
