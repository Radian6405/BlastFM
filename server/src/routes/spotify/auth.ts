import { Router, Request, Response, NextFunction } from "express";
import { aucthenticateJWT } from "../../util/authHelpers";
import dotenv from "dotenv";
import pool from "../../db";

const router: Router = Router();
dotenv.config({ path: "../../../../.env" });

// returns a url to redirect user to
router.get(
  "/connect-url",
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
      ["scope", "user-read-email user-library-read"], //TODO: update the scopes
      ["redirect_uri", "http://127.0.0.1:5173/spotify-connection-redirect"],
    ]).toString();

    res.status(200).send({
      url: "https://accounts.spotify.com/authorize?" + query,
    });
  }
);

// gets refresh and access token and saves user's refresh token
router.patch(
  "/save-token",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    const { auth_code } = req.body;
    if (auth_code === null || auth_code === undefined) {
      res.status(400).send({
        message: "Missing authorization code",
      });
      return;
    }

    let data;
    try {
      const buffer = Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      ).toString("base64");

      const token_response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + buffer,
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: auth_code,
            redirect_uri: "http://127.0.0.1:5173/spotify-connection-redirect",
          }),
        }
      );

      if (!token_response.ok) {
        res
          .status(400)
          .send({ message: "Could not get access and refresh tokens" });
        return;
      }

      data = await token_response.json();
    } catch (error) {
      console.log("Error at /spotify-oauth/save-token: \n", error);
      res.sendStatus(500);
      return;
    }

    // adding refresh token to database
    try {
      const updatedUser = await pool.query(
        "UPDATE users SET spotify_refresh_token = $1 WHERE id = $2",
        [data.refresh_token, req.user.id]
      );

      if (Number(updatedUser.rowCount) === 0) {
        res.status(400).send("could not update the user data");
        return;
      }

      res.status(200).send(data);
    } catch (error) {
      console.log("Error at /spotify-oauth/save-token: \n", error);
      res.sendStatus(500);
      return;
    }
  }
);

// gets acess tokens from refresh tokens
router.get(
  "/access-token",
  aucthenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user === null) {
      res.status(401).send({
        message: "Invalid token or no token provided",
      });
      return;
    }

    try {
      const user = await pool.query("SELECT * FROM users WHERE id = $1;", [
        req.user.id,
      ]);
      if (
        Number(user.rowCount) === 0 ||
        user.rows[0].spotify_refresh_token === null
      ) {
        res.status(400).send({
          message: "Could not get access token",
        });
        return;
      }

      const access_token = await getAccessToken(
        user.rows[0].spotify_refresh_token
      );
      if (access_token !== null) res.status(200).send(access_token);
    } catch (error) {
      console.log("Error at /spotify-oauth/access-token: \n", error);
      res.sendStatus(500);
      return;
    }
  }
);
async function getAccessToken(refresh_token: string) {
  if (process.env.SPOTIFY_CLIENT_ID === undefined) return null;

  const url = "https://accounts.spotify.com/api/token";

  const buffer = Buffer.from(
    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
  ).toString("base64");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + buffer,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  return response;
}

export default router;
