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

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
    document.body.style.backgroundColor = "rgba(var(--background))";
    document.body.style.color = "rgba(var(--text))";
  }, [theme]);
  return (
    <>
      <div
        className={
          location.pathname === "/login" || location.pathname === "/logout"
            ? "hidden"
            : "block"
        }
      >
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/my-listening" element={<MyListening />} />
        <Route
          path="/spotify-connection-redirect"
          element={<SpotifyRedirect />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
