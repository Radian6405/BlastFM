import { Route, Routes } from "react-router-dom";
import SpotifyRedirect from "./components/pages/SpotifyRedirect";
import Home from "./components/pages/Home";
import Navbar from "./components/util/Navbar";
import Playlists from "./components/pages/Playlists";
import Albums from "./components/pages/Albums";
import Songs from "./components/pages/Songs";
import MyListening from "./components/pages/MyListening";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import PlaylistPage from "./components/pages/PlaylistPage";
import AlbumPage from "./components/pages/AlbumPage";
import SongPage from "./components/pages/SongPage";
import { ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { getUserData } from "./util/getData";
import { user } from "./util/interfaces";
import { useCookies } from "react-cookie";

const globalTheme = createTheme({
  palette: {
    text: { primary: "rgba(var(--text))", secondary: "rgba(var(--text))" },
    background: {
      default: "rgba(var(--background))",
    },
    primary: { main: "rgba(var(--primary))" },
    secondary: { main: "rgba(var(--secondary))" },

    success: { main: "#82dd55" },
    error: { main: "#e23636" },
    warning: { main: "#edb95e" },
  },
});

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [user, setUser] = useState<user | null>(null);

  const location = useLocation();
  const [cookie] = useCookies(["token"]);

  useEffect(() => {
    document.body.className = theme;
    document.body.style.backgroundColor = "rgba(var(--background))";
    document.body.style.color = "rgba(var(--text))";
  }, [theme]);

  async function setupUser() {
    if (cookie.token === undefined) return;
    const data: user | null | string = await getUserData(cookie.token.token);
    if (typeof data !== "string" && data !== null) setUser(data);
  }

  useEffect(() => {
    setupUser();
  }, [, cookie]);
  return (
    <>
      <SnackbarProvider maxSnack={3} preventDuplicate autoHideDuration={3000}>
        <ThemeProvider theme={globalTheme}>
          <div
            className={
              location.pathname === "/login" || location.pathname === "/logout"
                ? "hidden"
                : "block"
            }
          >
            <Navbar user={user} theme={theme} setTheme={setTheme} />
          </div>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/my-listening" element={<MyListening />} />
            <Route
              path="/spotify-connection-redirect"
              element={<SpotifyRedirect />}
            />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/song/:id" element={<SongPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </ThemeProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;
