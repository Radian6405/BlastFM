import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import pool from "../db";
import jwt, { Secret } from "jsonwebtoken";

dotenv.config({ path: "../../../.env" });
const saltRounds: number = 10;

export const hashPassword = async (password: string) => {
  const salt: string = await bcrypt.genSalt(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compareSync(plain, hashed);

export function generateAccessToken(id: number) {
  return jwt.sign({ id: id }, process.env.JWT_TOKEN_SECRET as Secret, {
    expiresIn: process.env.JWT_TOKEN_LIFETIME ?? "1d",
  });
}

export function aucthenticateJWT(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;

  //if no token is sent
  if (authHeader === "undefined" || authHeader === undefined) {
    req.user = null;
    next();
    return;
  }

  jwt.verify(
    authHeader,
    process.env.JWT_TOKEN_SECRET as Secret,
    async (err: any, data: any) => {
      //jwt not verified
      if (err) {
        req.user = null;
        next();
        return;
      }

      let findUser;
      try {
        findUser = await pool.query(
          `SELECT id, username, email, 
          CASE 
            WHEN spotify_refresh_token IS NOT NULL 
              THEN TRUE 
              ELSE FALSE 
            END AS is_spotify_connected 
          FROM users 
          WHERE id = $1`,
          [data.id]
        );
      } catch (error) {
        console.log("Error at jwt authentication step:\n", error);
        req.user = null;
        next();
        return;
      }

      //no user found
      if (Number(findUser.rowCount) === 0) {
        req.user = null;
        next();
        return;
      }

      // user found
      req.user = { ...findUser.rows[0] };
      next();
    }
  );
}
