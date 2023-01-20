import express, { Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let app = express();
app.use(express.json());

// create database "connection"
let db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

let authors = await db.all("SELECT * FROM authors");
let books = await db.all("SELECT * FROM books");
console.log("Authors", authors);
console.log("Books", books);

// insert example
// await db.run(
//     "INSERT INTO authors(id, name, bio) VALUES('1', 'Figginsworth III', 'A traveling gentleman.')"
// );
// await db.run(
//     "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES ('1', '1', 'My Fairest Lady', '1866', 'romance')"
// );

// GET/POST/DELETE example
interface Book {
  id: string;
  author_id: string;
  title: string;
  pub_year: string;
  genre: string;
}

interface Author {
  id: string;
  name: string;
  bio: string;
}

interface Error { 
  error: string;
}

interface Success {
  message: string;
  table: Book | Author;  
}

type BookResponse = Response<Book[] | Error>;

type AuthorResponse = Response<Author[] | Error>;

type PostResponse = Response<Success | Error>;

// get all books 
app.get("/books", (req: any, res: BookResponse) => {
  return res.status(200).json(books);
});

// get all books on or after a certain year
app.get("/book", (req: any, res: BookResponse) => {
  const year = req.query.year;
  if (!year) {
    return res.status(400).json({ error: "Book is required" });
  }
  if (isNaN(year)) {
    return res.status(400).json({ error: `Year is not valid` });
  }
  let filteredBooks = books.filter((book: Book) => book.pub_year >= year);
  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }
  return res.status(400).json({ error: `No books on or after ${year} found` })
});

// get 1 book with id
app.get("/book/:id", (req, res: BookResponse) => {
  const id = req.params.id;
  if(!id) {
    return res.status(400).json({ error: `Please provide an id for book` });
  }
  let book = books.find((book: Book) => book.id === id);
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(400).json({ error: `No books with ID ${id} found` });
  }
});

// insert a book
app.post("/book", async (req, res: PostResponse) => {
  const book = req.body.book;
  if (!book) {
    return res.status(400).json({ error: "Book is required" });
  }
  let year = Number(book.pub_year);
  if (isNaN(year)) {
    return res.status(400).json({ error: `Public year is not valid` });
  }
  let author = authors.find((author: Author) => author.id === book.author_id);
  if (!author) {
    return res.status(400).json({ error: `No authors with ID ${book.author_id} found` });
  }
  let id = books.length > 0 ? `${Math.max(...books.map((book: Book) => Number(book.id))) + 1}` : "1";
  let INSERT_SQL = await db.prepare(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)" 
  );
  book.id = id;
  books.push(book);
  await INSERT_SQL.bind([id, book.author_id, book.title, book.pub_year, book.genre]);
  await INSERT_SQL.run().then(() => {
    return res.json({ message: `Successfully added. Book ID is ${id}`, table: book });
  });
});

// put to update a book
app.put("/book/:id", async (req, res: any) => {
  const bookReq = req.body.book;
  const id = req.params.id;
  if (!bookReq) {
    return res.status(400).json({ error: "Book is required" });
  }
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let book = books.find((book: Book) => book.id === id);
  if (!book) {
    return res.status(400).json({ error: `No books with ID ${id} found` });
  }
  
  book.title = bookReq.title;
  book.pub_year = bookReq.pub_year;
  book.genre = bookReq.genre;

  await db.run(`UPDATE books set author_id = ?, title = ?, pub_year = ?, genre = ? WHERE id = ?`,
         [book.author_id, book.title, book.pub_year, book.genre, id]);
  return res.sendStatus(200);
});

app.delete("/book/:id", async (req, res: any) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  let book = books.find((book: Book) => book.id === id);
  if(!book) {
    return res.status(400).json({ error: `No books with ID ${id} found` });
  }
  books = books.filter((book: Book) => book.id != id);
  await db.run(`DELETE FROM books WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

// get all authors 
app.get("/authors", (req, res: AuthorResponse) => {
  return res.json(authors);
});

// get 1 author with id
app.get("/author/:id", (req, res: AuthorResponse) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: `Please provide an id for author` });
  }
  let author = authors.find((author: Author) => author.id === id);
  if (author) {
    return res.status(200).json(author);
  } else {
    return res.status(400).json({ error: `No authors with ID ${id} found` });
  }
});

// insert an author
app.post("/author", async (req, res: PostResponse) => {
  const author = req.body.author;
  if (!author) {
    return res.status(400).json({ error: "Author is required" });
  }
  let id = authors.length > 0 ? `${Math.max(...authors.map((author: Author) => Number(author.id))) + 1}` : "1";
  let INSERT_SQL = await db.prepare(
    "INSERT INTO authors(id, name, bio) VALUES (?, ?, ?)" 
  );
  author.id = id;
  authors.push(author);
  await INSERT_SQL.bind([id, author.name, author.bio]);
  await INSERT_SQL.run().then(() => {
    return res.json({ message: `Successfully added. Author ID is ${id}`, table: author });
  });
});

// put to update an author
app.put("/author/:id", (req, res: any) => {
  const authorReq = req.body.author;
  const id = req.params.id;
  if (!authorReq) {
    return res.status(400).json({ error: "Author is required" });
  }
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let author = authors.find((author: Author) => author.id === id);

  if (!author) {
    return res.status(400).json({ error: `No authors with ID ${id} found` });
  }
  
  author.name = authorReq.name;
  author.bio = authorReq.bio;

  db.run(`UPDATE authors set name = ?, bio = ? WHERE id = ?`,
      [author.name, author.bio, id]);
  return res.sendStatus(200);
});

//  delte author but not delete author that has books
app.delete("/author/:id", async (req, res: any) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  let book = books.find((book: Book) => book.author_id === id);
  if (book) {
    return res.status(400).json({ error: "Cannot delete since author still has books associated with them" });
  }
  let author = authors.find((author: Author) => author.id === id);
  if(!author) {
    return res.status(400).json({ error: `No authors with ID ${id} found` });
  }
  authors = authors.filter((author: Author) => author.id != id);
  await db.run(`DELETE FROM authors WHERE id = ?`, [id]);
  return res.sendStatus(200);
});

// Author
/*************
app.get("/author", (req, res: AuthorResponse) => {
    if (!req.query.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.query.bar} in the query` });
});

app.post("/author", (req, res: AuthorResponse) => {
    if (!req.body.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.body.bar} in the body` });
});

app.delete("/author", (req, res) => {
    // etc.
    res.sendStatus(200);
});

***********/


//
// ASYNC/AWAIT EXAMPLE
//

// function sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// need async keyword on request handler to use await inside it
// app.get("/bar", async (req, res: FooResponse) => {
//     console.log("Waiting...");
//     // await is equivalent to calling sleep.then(() => { ... })
//     // and putting all the code after this in that func body ^
//     await sleep(3000);
//     // if we omitted the await, all of this code would execute
//     // immediately without waiting for the sleep to finish
//     console.log("Done!");
//     return res.sendStatus(200);
// });

// curl http://localhost:3000/bar
// run server

// insert example with parameterized queries
// important to use parameterized queries to prevent SQL injection
// when inserting untrusted data
// let statement = await db.prepare(
//     "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)"
// );
// await statement.bind(["2", "1", "A Travelogue of Tales", "1867", "adventure"]);
// await statement.run();

// select examples
// let authors = await db.all("SELECT * FROM authors");
// let books = await db.all("SELECT * FROM books WHERE author_id = '1'");
// let filteredBooks = await db.all("SELECT * FROM books WHERE pub_year = '1867'");
// console.log("Some books", filteredBooks);

let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
