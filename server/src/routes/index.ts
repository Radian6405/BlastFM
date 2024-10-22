import { Router } from "express";
import authRouter from "./auth";
import playlistRouter from "./playlist";

const router: Router = Router();

router.use(authRouter);
router.use(playlistRouter);

export default router;
