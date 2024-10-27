import { Route, Routes } from "react-router-dom";
import SpotifyRedirect from "./components/pages/SpotifyRedirect";
import Home from "./components/pages/Home";
import Navbar from "./components/util/Navbar";
import Playlists from "./components/pages/Playlists";
import Albums from "./components/pages/Albums";
import Songs from "./components/pages/Songs";
import MyListening from "./components/pages/MyListening";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
    document.body.style.backgroundColor = "var(--background)";
    document.body.style.color = "var(--text)";
  }, [theme]);
  return (
    <>
      <Navbar />
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
      </Routes>
    </>
  );
}

export default App;
