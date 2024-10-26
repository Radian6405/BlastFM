import { Router } from "express";
import authRouter from "./auth";
import playlistRouter from "./playlist";
import songRouter from "./song";
import albumRouter from "./album";
import spotifyAuthRouter from "./spotify/auth";
import spotifyDataRouter from "./spotify/data";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/playlist", playlistRouter);
router.use("/song", songRouter);
router.use("/album", albumRouter);
router.use("/spotify-oauth", spotifyAuthRouter);
router.use("/spotify-data", spotifyDataRouter);

export default router;
