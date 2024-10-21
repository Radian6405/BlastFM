import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";

export const UsernameValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;
  const usernameCheck = /^[A-Za-z0-9_.]{6,16}$/;

  if (!usernameCheck.test(username)) {
    res.status(401).send({ message: "Invalid Username" });
    return;
  }

  next();
};

export const UsernameAvailabilityValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  // username availability check
  const findUserUsername = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (findUserUsername.rowCount === null || findUserUsername.rowCount > 0) {
    res.status(401).send({ message: "Username already taken" });
    return;
  }
  next();
};

export const PasswordValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const passwordCheck = /^[\S]{6,256}$/;

  if (!passwordCheck.test(password)) {
    res.status(401).send({ message: "Invalid Password" });
    return;
  }

  next();
};

export const EmailValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailCheck.test(email)) {
    res.status(401).send({ message: "Invalid Email address" });
    return;
  }

  next();
};

export const EmailAvailabilityValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  // email availability check
  const findUserEmail = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (findUserEmail.rowCount === null || findUserEmail.rowCount > 0) {
    res.status(401).send({ message: "Email address already exists" });
    return;
  }

  next();
};
