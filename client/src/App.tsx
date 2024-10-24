import { Route, Routes } from "react-router-dom";
import SpotifyRedirect from "./components/pages/SpotifyRedirect";
import Home from "./components/pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/spotify-connection-redirect"
          element={<SpotifyRedirect />}
        />
      </Routes>
    </>
  );
}

export default App;
