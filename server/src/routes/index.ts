import { Router } from "express";
import authRouter from "./auth";
import playlistRouter from "./playlist";
import songRouter from "./song";
import albumRouter from "./album";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/playlist", playlistRouter);
router.use("/song", songRouter);
router.use("/album", albumRouter);

export default router;
