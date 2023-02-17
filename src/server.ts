import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Book, Author, BookResponse, AuthorResponse, PostResponse } from "./type.js";
import cookieParser from "cookie-parser";
import { login, logout, signup, authorizeUser, authorizeAdmin } from "./authorization.js";

import * as url from "url";
import * as path from "path";
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let publicStaticFolder = path.resolve(__dirname, "out", "public");

let app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

let db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});

await db.get("PRAGMA foreign_keys = ON");

/* AUTHORIZATION */
app.post("/login", login);
app.post("/logout", logout);
app.post("/signup", signup);

// get all books or get all books on or after a certain year
app.get("/api/books", async (req, res: BookResponse) => {
  const year = req.query.year;
  if (!year) {
    let books = await db.all("SELECT * FROM books");
    return res.status(200).json(books);
  }
  if (isNaN(+year)) {
    return res.status(400).json({ error: "Year is not valid. Year must be a number." });
  }
  let filteredBooks = await db.all(`SELECT * FROM books WHERE pub_year >= ?`, [year]);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(400).json({ error: `No books on or after ${year} found` })
});

// get 1 book with id
app.get("/api/books/:id", async (req, res: BookResponse) => {
  const id = req.params.id;
  if(!id) {
    return res.status(400).json({ error: "Please provide an id for book" });
  }
  let book = await db.all(`SELECT * FROM books WHERE id = ${id}`);
  if (book.length != 0) {
    return res.status(200).json(book);
  } else {
    return res.status(400).json({ error: `No books with ID ${id} found. Please check the books list to see valid book ID.` });
  }
});

// insert a book
app.post("/api/books", authorizeUser, async (req, res: PostResponse) => {
  const book = req.body.book;
  if (!book) {
    return res.status(400).json({ error: "Book is required" });
  }
  if (isNaN(+book.pub_year)) {
    return res.status(400).json({ error: `Public year is not valid. Year must be a number.` });
  }
  let author = await db.all(`SELECT * FROM authors WHERE id = ${book.author_id}`);
  if (author.length === 0) {
    return res.status(400).json({ error: `No authors with ID ${book.author_id} found. Please check the authors list to see valid author ID or to add new author.` });
  }
  let b = await db.all("SELECT * FROM books")
  let id = b.length > 0 ? `${Math.max(...b.map((book: Book) => Number(book.id))) + 1}` : "1";
  let INSERT_SQL = await db.prepare(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)"
  );
  await INSERT_SQL.bind([id, book.author_id, book.title, book.pub_year, book.genre]);
  await INSERT_SQL.run().then(() => {
    return res.json({ message: `Successfully added. Book ID is ${id}`, table: book });
  });
});

// put to update a book
app.put("/api/books/:id", authorizeUser, async (req, res: BookResponse) => {
  const bookReq = req.body.book;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let book = await db.all(`SELECT * FROM books WHERE id = '${id}'`);
  if (book.length === 0) {
    return res.status(400).json({ error: `No books with ID ${id} found. Please check the books list to see valid book ID.` });
  }

  const updates = [];
  if (bookReq.author_id) {
    let author = await db.all(`SELECT * FROM books WHERE id = '${bookReq.author_id}'`);
    if (author.length === 0) {
      return res.status(400).json({ error: `No authors with ID ${bookReq.author_id} found. Please check the authors list to see valid author ID.` });
    }
    updates.push(`author_id = "${bookReq.author_id}"`);
  }
  if (bookReq.pub_year) {
    if (isNaN(+bookReq.pub_year)) {
      return res.status(400).json({ error: `Public year is not valid. Year must be a number.` });
    }
    updates.push(`pub_year = "${bookReq.pub_year}"`);
  }
  if (bookReq.title) {
    updates.push(`title = "${bookReq.title}"`);
  }
  if (bookReq.genre) {
    updates.push(`genre = "${bookReq.genre}"`);
  }
  if (updates.length === 0) {
    res.status(400).json({ error: "Book is required" });
    return;
  }
  await db.run(`UPDATE books SET ${updates.join(', ')} WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

// delete a book
app.delete("/api/books/:id", authorizeUser, async (req, res: BookResponse) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  let book = await db.all(`SELECT * FROM books WHERE id = '${id}'`);
  if(book.length === 0) {
    return res.status(400).json({ error: `No books with ID ${id} found. Please check the books list to see valid book ID.` });
  }
  await db.run(`DELETE FROM books WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

// AUTHOR
// get all authors
app.get("/api/authors", async (req, res: AuthorResponse) => {
  let authors = await db.all("SELECT * FROM authors");
  return res.status(200).json(authors);
});

// get 1 author with id
app.get("/api/authors/:id", async (req, res: AuthorResponse) => {
  const id = req.params.id;
  if(!id) {
    return res.status(400).json({ error: "Please provide an id for author" });
  }
  let author = await db.all(`SELECT * FROM authors WHERE id = '${id}'`);
  if (author.length != 0) {
    return res.status(200).json(author);
  } else {
    return res.status(400).json({ error: `No authors with ID ${id} found. Please check the authors list to see valid author ID.` });
  }
});

// insert an author
app.post("/api/authors", authorizeUser, async (req, res: PostResponse) => {
  const author = req.body.author;
  if (!author) {
    return res.status(400).json({ error: "Author is required" });
  }
  let a = await db.all("SELECT * FROM authors")
  let id = a.length > 0 ? `${Math.max(...a.map((author: Author) => Number(author.id))) + 1}` : "1";
  let INSERT_SQL = await db.prepare(
    "INSERT INTO authors(id, name, bio) VALUES (?, ?, ?)"
  );
  await INSERT_SQL.bind([id, author.name, author.bio]);
  await INSERT_SQL.run().then(() => {
    return res.json({ message: `Successfully added. Author ID is ${id}`, table: author });
  });
});

// put to update a author
app.put("/api/authors/:id", authorizeUser, async (req, res: AuthorResponse) => {
  const authorReq = req.body.author;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let author = await db.all(`SELECT * FROM authors WHERE id = '${id}'`);
  if (author.length === 0) {
    return res.status(400).json({ error: `No authors with ID ${id} found. Please check the authors list to see valid author ID.` });
  }

  const updates = [];
  if (authorReq.name) {
    updates.push(`name = "${authorReq.name}"`);
  }
  if (authorReq.bio) {
    updates.push(`bio = "${authorReq.bio}"`);
  }
  if (updates.length === 0) {
    res.status(400).json({ error: "Author is required" });
    return;
  }
  await db.run(`UPDATE authors SET ${updates.join(', ')} WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

//  delete author but not delete author that has books
app.delete("/api/authors/:id", authorizeUser, async (req, res: AuthorResponse) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  let book = await db.all(`SELECT * FROM books WHERE author_id = '${id}'`);
  if (book.length != 0) {
    return res.status(400).json({ error: "Cannot delete since author still has books associated with them" });
  }
  let author = await db.all(`SELECT * FROM authors WHERE id = '${id}'`);
  if(author.length === 0) {
    return res.status(400).json({ error: `No authors with ID ${id} found. Please check the authors list to see valid author ID.` });
  }
  await db.run(`DELETE FROM authors WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

app.use(express.static("public"));
app.get("/*", (req, res) => {
    res.sendFile("index.html", { root: publicStaticFolder });
});

let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
