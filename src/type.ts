import { Response } from "express";

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

interface MessageResponse {
  message: string;
  token?: string;
}

type EmptyResponse = "";

type BookResponse = Response<Book[] | Error>;

type AuthorResponse = Response<Author[] | Error>;

type PostResponse = Response<Success | Error>;

export { Book, Author, Error, Success, BookResponse, AuthorResponse, PostResponse, MessageResponse, EmptyResponse };
