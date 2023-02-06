import axios, { AxiosError } from "axios";
import { response } from "express";

let port = 3000;
let host = "localhost";
let protocol = "http";
let baseUrl = `${protocol}://${host}:${port}`;


/****************** HAPPY PATH ******************/
test("Add 1 Author", async () =>{
  const author = {
    name: "Figginsworth III",
    bio: "A traveling gentleman.",
  }
  let result = await axios.post(`${baseUrl}/api/authors`, { author });
  const data = result.data;
  expect(data.message).toEqual("Successfully added. Author ID is 6");
});

test("Add 1 Book", async () => {
  const book = {
    author_id: "6",
    title: "The Book of John",
    pub_year: "2023",
    genre: "Fiction",
  }
  let result = await axios.post(`${baseUrl}/api/books`, { book });
  const data = result.data;
  expect(data.message).toEqual("Successfully added. Book ID is 7");
});

test("Get all authors", async () => {
  let result = await axios.get(`${baseUrl}/api/authors`);
  expect(result.status).toEqual(200);
});

test("Get author with ID", async () => {
  let id = `6`;
  let result = await axios.get(`${baseUrl}/api/authors/${id}`);
  expect(result.status).toEqual(200);
});

test("Get all books", async () => {
  let result = await axios.get(`${baseUrl}/api/books`);
  expect(result.status).toEqual(200);
});

test("Get book with ID", async () => {
  let id = `7`;
  let result = await axios.get(`${baseUrl}/api/books/${id}`);
  expect(result.status).toEqual(200);
});

test("Get books with year", async () => {
  let year = "2023";
  let result = await axios.get(`${baseUrl}/api/books?year=${year}`);
  expect(result.data[0].title).toEqual("The Book of John");
  expect(result.status).toEqual(200);
});

test("Update book", async () => {
  const book = {
    id: "7",
    title: "The of John",
    pub_year: "2021"
  }
  let result = await axios.put(`${baseUrl}/api/books/7`, { book });
  expect(result.status).toEqual(200);
});

test("Update author", async () => {
  const author = {
    id: "6",
    bio: "A gentleman."
  }
  let result = await axios.put(`${baseUrl}/api/authors/6`, { author });
  expect(result.status).toEqual(200);
});

test("Create book with invalid year", async () => {
  const book = {
    author_id: "6",
    title: "The Book of John",
    pub_year: "2020a",
    genre: "Fiction",
  }
  try {
    await axios.post(`${baseUrl}/api/books`, { book });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "Public year is not valid. Year must be a number." });
  }
});

test("Get books with year but no result", async () => {
  let year = '2025'
  try {
    await axios.get(`${baseUrl}/api/books?year=${year}`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books on or after ${year} found` });
  }
});

test("Get book with invalid ID", async () => {
  let id = `23`;
  try {
    await axios.get(`${baseUrl}/api/books/${id}`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID ${id} found. Please check the books list to see valid book ID.` });
  }
});

test("Get author with invalid ID", async () => {
  let id = `21`;
  try {
    await axios.get(`${baseUrl}/api/authors/${id}`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No authors with ID ${id} found. Please check the authors list to see valid author ID.` });
  }
});

test("Update book fail, !book found", async () => {
  let id = "69420"
  const book = {
    id: id,
    author_id: "1",
    title: "The of John",
    pub_year: "2020",
    genre: "Fiction",
  }
  try {
    await axios.put(`${baseUrl}/api/books/${id}`, { book });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID ${id} found. Please check the books list to see valid book ID.` });
  }
});

test("Update author fail, !author found", async () => {
  const author = {
    id: "1a",
    name: "Figginsworth III",
    bio: "A gentleman.",
  }
  try {
    await axios.put(`${baseUrl}/api/authors/1a`, { author });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "No authors with ID 1a found. Please check the authors list to see valid author ID." });
  }
});

test("Delete book fail, !book found ", async () => {
  try {
    await axios.delete(`${baseUrl}/api/books/69420`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID 69420 found. Please check the books list to see valid book ID.` });
  }
});

test("Delete author fail due to existing book", async () => {
  try {
    await axios.delete(`${baseUrl}/api/authors/6`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "Cannot delete since author still has books associated with them" });
  }
});

test("Delete a book", async () => {
  let result = await axios.delete(`${baseUrl}/api/books/7`);
  expect(result.status).toEqual(200);
});

test("Delete an author", async () => {
    let result = await axios.delete(`${baseUrl}/api/authors/6`);
    expect(result.status).toEqual(200);
});
