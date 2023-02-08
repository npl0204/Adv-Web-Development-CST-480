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
import {  MessageResponse, EmptyResponse } from "./type.js";

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

// need to use same options when creating and deleting cookie
// or cookie won't be deleted
let cookieOptions: CookieOptions = {
  httpOnly: true, // JS can't access it
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
      return res.status(200).cookie("token", token, cookieOptions).json({ message: "Logged in" })
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

let authorizeUser: RequestHandler = (req, res, next) => {
  let { token } = req.cookies;
  console.log(req)
  console.log(token);
  if (token === undefined) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
};

let authorizeAdmin: RequestHandler = (req, res, next) => {
  let { token } = req.cookies;
  console.log(req)
  console.log(token);
  if (token === undefined) {
    return res.status(401).json({ message: "Not logged in" });
  }
  if (tokenStorage[token].role !== "admin") {
    return res.status(403).json({ message: "Not authorized"})
  };
  next();
}


// function publicAPI(req: Request, res: Response<MessageResponse>) {
//     return res.json({ message: "A public message" });
// }
// function privateAPI(req: Request, res: Response<MessageResponse>) {
//   return authorize
// }

export { login, logout, authorizeUser, authorizeAdmin }
