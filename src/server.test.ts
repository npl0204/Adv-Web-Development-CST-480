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
  let result = await axios.post(`${baseUrl}/author`, { author });
  const data = result.data;
  expect(data.message).toEqual("Successfully added. Author ID is 1");
});

test("Add 1 Book", async () => {
  const book = {
    author_id: "1",
    title: "The Book of John",
    pub_year: "2020",
    genre: "Fiction",
  }
  let result = await axios.post(`${baseUrl}/book`, { book });
  const data = result.data;
  expect(data.message).toEqual("Successfully added. Book ID is 1");
});

test("Get all authors", async () => {
  let result = await axios.get(`${baseUrl}/authors`);
  expect(result.status).toEqual(200);
});

test("Get author with ID", async () => {
  let id = `1`;
  let result = await axios.get(`${baseUrl}/author/${id}`);
  expect(result.status).toEqual(200);
});

test("Get all books", async () => {
  let result = await axios.get(`${baseUrl}/books`);
  expect(result.status).toEqual(200);
});

test("Get book with ID", async () => {
  let id = `1`;
  let result = await axios.get(`${baseUrl}/book/${id}`);
  expect(result.status).toEqual(200);
});

test("Get books with year", async () => {
  let year = `1986`;
  let result = await axios.get(`${baseUrl}/book?year=${year}`);
  expect(result.data[0].title).toEqual("The Book of John");
  expect(result.status).toEqual(200);
});

test("Update book", async () => {
  const book = {
    id: "1",
    author_id: "1",
    title: "The of John",
    pub_year: "2020",
    genre: "Fiction",
  }
  let result = await axios.put(`${baseUrl}/book/1`, { book });
  expect(result.status).toEqual(200);
});

test("Update author", async () => {
  const author = {
    id: "1",
    name: "Figginsworth III",
    bio: "A gentleman.",
  }
  let result = await axios.put(`${baseUrl}/author/1`, { author });
  expect(result.status).toEqual(200);
});

test("Create book with invalid year", async () => {
  const book = {
    author_id: "1",
    title: "The Book of John",
    pub_year: "2020a",
    genre: "Fiction",
  }
  try {
    await axios.post(`${baseUrl}/book`, { book });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "Public year is not valid" });
  }
});

test("Get books with year but no result", async () => {
  let year = '2025'
  try {
    await axios.get(`${baseUrl}/book?year=${year}`);
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
  let id = `1a`;
  try {
    await axios.get(`${baseUrl}/book/${id}`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID ${id} found` });
  }
});

test("Get author with invalid ID", async () => {
  let id = `2b`;
  try {
    await axios.get(`${baseUrl}/author/${id}`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No authors with ID ${id} found` });
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
    await axios.put(`${baseUrl}/book/${id}`, { book });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID ${id} found` });
  }
});

test("Update author fail, !author found", async () => {
  const author = {
    id: "1a",
    name: "Figginsworth III",
    bio: "A gentleman.",
  }
  try {
    await axios.put(`${baseUrl}/author/1a`, { author });
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: "No authors with ID 1a found" });
  }
});

test("Delete book fail, !book found ", async () => {
  try {
    await axios.delete(`${baseUrl}/book/69420`);
  } catch (error) {
    let errorObj = error as AxiosError;
    if (errorObj.response === undefined) {
      throw errorObj;
    }
    let { response } = errorObj;
    expect(response.status).toEqual(400);
    expect(response.data).toEqual({ error: `No books with ID 69420 found` });
  }
});

test("Delete author fail due to existing book", async () => {
  try {
    await axios.delete(`${baseUrl}/author/1`);
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
  let result = await axios.delete(`${baseUrl}/book/1`);
  expect(result.status).toEqual(200);
});

test("Delete author", async () => {
    let result = await axios.delete(`${baseUrl}/author/1`);
    expect(result.status).toEqual(200);
});
