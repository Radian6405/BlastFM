import { Router } from "express";
import authRouter from "./auth";
import playlistRouter from "./playlist";
import songRouter from "./song";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/playlist", playlistRouter);
router.use("/song", songRouter);

export default router;
