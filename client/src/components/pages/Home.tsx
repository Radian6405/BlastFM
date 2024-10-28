import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="p-28">
        <div className="grid h-full w-full grid-cols-2 grid-rows-3 gap-x-12">
          <div className="col-span-1 row-span-1 row-start-1 flex flex-col items-start justify-end gap-4">
            <div className="text-7xl font-bold">
              <span className="from-primary to-accent inline-block bg-gradient-to-r bg-clip-text text-transparent">
                Effortlessly
              </span>{" "}
              track
            </div>
            <div className="text-5xl">and organize your music</div>
          </div>
          <div className="col-span-1 row-span-1 row-start-2 flex flex-col items-start justify-center">
            <div className="text-wrap text-xl leading-8 ">
              Organize and track your playlists, albums, monitor listening
              trends, and discover new music. Personalize your experience and
              keep your favorite music perfectly in sync — all in one place.
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
          <div className="-start-2 col-span-1 row-span-3 flex flex-col items-center justify-center">
            <div className="bg-accent h-[24rem] w-[32rem]"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
