import { Router, Request, Response, NextFunction } from "express";
import { aucthenticateJWT } from "../../util/authHelpers";
import dotenv from "dotenv";

const router: Router = Router();
dotenv.config({ path: "../../../../.env" });

router.get(
  "/connect",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    if (
      process.env.SPOTIFY_CLIENT_ID === null ||
      process.env.SPOTIFY_CLIENT_ID === undefined
    ) {
      res.sendStatus(500);
      console.log("No spotify client ID given");
      return;
    }

    const query: string = new URLSearchParams([
      ["response_type", "code"],
      ["client_id", process.env.SPOTIFY_CLIENT_ID],
      ["scope", "user-read-email"],
      [
        "redirect_uri",
        "http://localhost:8000/api/spotify-oauth/connection-redirect",
      ],
    ]).toString();

    res.status(200).send({
      url: "https://accounts.spotify.com/authorize?" + query,
    });
  }
);

export default router;
