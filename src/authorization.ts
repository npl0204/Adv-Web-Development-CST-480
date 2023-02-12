import * as argon2 from "argon2";
import crypto from "crypto";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
    Request,
    Response,
    RequestHandler,
    CookieOptions,
} from "express";

// TODO: MAKE ZOD WORK!!! SOME WEIRD TS ERROR IDK
// import { z } from "zod";
import {  MessageResponse, EmptyResponse, PostResponse } from "./type.js";

let db = await open({
  filename: "../database.db",
  driver: sqlite3.Database,
});

// let loginSchema = z.object({
//   username: z.string().min(1),
//   password: z.string().min(1),
// });

function makeToken() {
  return crypto.randomBytes(32).toString("hex");
}

// e.g. { "z7fsga": { username: "mycoolusername" } }
let tokenStorage: { [key: string]: { username: string, role: string } } = {};

let cookieOptions: CookieOptions = {
  httpOnly: false, // JS can't access it
  secure: true, // only sent over HTTPS connections
  sameSite: "strict", // only sent to this domain
};

async function login(req: Request, res: Response<MessageResponse>) {
  // let parseResult = loginSchema.safeParse(req.body);
  // if (!parseResult.success) {
  //   return res
  //   .status(400)
  //   .json({ message: "Username or password invalid" });
  // }
  let { username, password } = req.body;
  console.log(username, password)
  let user = await db.get("SELECT * FROM users WHERE username = ?", username)
  if (user) {
    const storedPassword = user.password;
    if (await argon2.verify(storedPassword, password)) {
      let token = makeToken();
      tokenStorage[token] = { username, role: user.role };
      return res.status(200).cookie("token", token, cookieOptions).json({ message: "Logged in", token: token })
    }
  }
  return res.status(400).json({ message: "Username or password invalid" });
}

async function logout(req: Request, res: Response<EmptyResponse>) {
  let { token } = req.cookies;
  if (token === undefined) {
    // already logged out
    return res.send();
  }
  if (!tokenStorage.hasOwnProperty(token)) {
    // token invalid
    return res.send();
  }
  delete tokenStorage[token];
  return res.clearCookie("token", cookieOptions).send();
}

async function signup(req: Request, res: Response<MessageResponse>) {
  let { username, password } = req.body;
  let user = await db.get("SELECT * FROM users WHERE username = ?", username)
  if (user) {
    return res.status(400).json({ message: "Username has been used. Please choose a new one." });
  }
  const hashedPassword = await argon2.hash(password);
  const result = await db.run("INSERT INTO users (username, password) VALUES (?, ?)", username, hashedPassword);

  if (result.lastID) {
    let token = makeToken();
    tokenStorage[token] = { username, role: 'user' };
    return res.status(200).cookie("token", token, cookieOptions).json({ message: "User created", token: token });
  } else {
    return res.status(500).json({ message: "Could not create user" });
  }
}

let authorizeUser: RequestHandler = (req, res: PostResponse, next) => {
  let { token } = req.cookies;
  console.log(token);
  if (token === undefined || !tokenStorage.hasOwnProperty(token)) {
    return res.status(401).json({ error: "Not logged in" });
  }
  next();
};

let authorizeAdmin: RequestHandler = (req, res: PostResponse, next) => {
  let { token } = req.cookies;
  console.log(token);
  if (token === undefined || !tokenStorage.hasOwnProperty(token)) {
    return res.status(401).json({ error: "Not logged in" });
  }
  if (tokenStorage[token].role !== "admin") {
    return res.status(403).json({ error: "Not authorized"})
  };
  next();
}

export { login, logout, signup, authorizeUser, authorizeAdmin }
