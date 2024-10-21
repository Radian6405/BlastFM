import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import {
  aucthenticateJWT,
  comparePassword,
  generateAccessToken,
  hashPassword,
} from "../util/authHelpers";
import {
  EmailAvailabilityValidation,
  EmailValidation,
  PasswordValidation,
  UsernameAvailabilityValidation,
  UsernameValidation,
} from "../util/validationHelp";
const router: Router = Router();

router.post(
  "/api/signup",
  UsernameValidation,
  UsernameAvailabilityValidation,
  EmailValidation,
  EmailAvailabilityValidation,
  PasswordValidation,
  async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword: string = await hashPassword(password);

      const newUser = await pool.query(
        "INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *",
        [username, email, hashedPassword]
      );

      res.status(201).send({
        message: `Successfully registered as ${username}`,
        token: generateAccessToken(newUser.rows[0].user_id),
      });
    } catch (error) {
      console.log("Error at /api/signup route:\n", error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/api/signin",
  UsernameValidation,
  PasswordValidation,
  async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const findUser = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (
        Number(findUser.rowCount) > 0 &&
        comparePassword(password, findUser.rows[0].password)
      ) {
        res.status(200).send({
          message: `Successfully logged in as ${findUser.rows[0].username}`,
          token: generateAccessToken(findUser.rows[0].user_id),
        });
      } else {
        res.status(401).send({
          message: "Invalid credentials, please check and try again",
        });
      }
    } catch (error) {
      console.log("Error at /api/signin route:\n", error);
      res.sendStatus(500);
    }
  }
);

router.get("/api/userdata", aucthenticateJWT, (req: Request, res: Response) => {
  if (req.user === null) {
    res.status(401).send({
      message: "Invalid token or no token provided",
    });
  } else res.send(req.user);
});

export default router;
