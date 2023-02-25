import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorType, BookType, Error } from '../../src/type';
import { Link } from 'react-router-dom';
import { Typography, IconButton, Input, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

function Books() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([] as BookType[]);
  const [searchInput, setSearchInput] = useState("");
  const [sortedBooks, setSortedBook] = useState([] as BookType[]);
  const [authors, setAuthors] = useState([] as AuthorType[]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    console.log("Getting datas")
    axios.get('/api/books').then((res) => {
      setBooks(res.data);
      setSortedBook(sortBooks(res.data));
    });
    axios.get('/api/authors').then((res) => {
      setAuthors(res.data);
      setLoading(false);
    })
  }

  const getAuthorName = (id: string) => {
    const author = authors.find((a) => a.id === id);
    if (author) {
      return author.name;
    }
    return "";
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (books.length === 0) {
    return  <div className="row">
      <Typography variant="h4" color="lightpink"><b>All Books</b></Typography>
      <input
        className="form-control col-12 mt-3 mb-3"
        type="search"
        placeholder="Display all Books Published after Year ..."
        value={searchInput}
        onChange={handleChangeYear}/>
      <Typography variant="h6" className="alert"> No books found</Typography>
    </div>;
  }

  function handleChangeYear(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);
    let value = event.target.value;
    if(isNaN(Number(event.target.value))) {
      value = "";
      alert("Please enter a valid year. Year must be a number.");
    }
    if (value === "") {
      setSortedBook(sortBooks(books));
    }
    const books_filtered = books.filter((book) => {
      return Number(book.pub_year) >= Number(value);
    });
    setSortedBook(sortBooks(books_filtered));
  }

  function sortBooks(books: BookType[]) {
    return books.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  async function handleDelete(id: any, e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.delete(`/api/books/${id}`)
      .then((res) => {
        alert("Book was deleted.");
        window.location.reload();
        console.log(res.data);
      });
    } catch(error) {
      let errorObj = error as AxiosError;
      if (errorObj.response === undefined) {
        throw errorObj;
      }
      let { response } = errorObj;
      let data = response.data as Error;
      alert(data.error);
      console.log(response);
    }
  }

  return (
    <div className="row">
    <Container component="main" sx={{ mt: 5, mb: 2 }} maxWidth="lg">
    <Typography variant="h4" color="lightpink"><b>All Books</b></Typography>
    <FormControl fullWidth>
      <Input
            aria-describedby="my-helper-text"
            onChange={handleChangeYear}
            placeholder="Display Books Published after Year ..."
            value={searchInput} />
    </FormControl>
    </Container>
    <Container component="main" sx={{ mt: 0, mb: 5 }} maxWidth="lg">
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell><b>Book</b></TableCell>
            <TableCell align="center"><b>Book ID</b></TableCell>
            <TableCell align="center"><b>Author Name</b></TableCell>
            <TableCell align="center"><b>Author ID</b></TableCell>
            <TableCell align="center"><b>Publication Year</b></TableCell>
            <TableCell align="center"><b>Genre</b></TableCell>
            <TableCell align="center"><b>Delete</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBooks.map((book) => (
            <TableRow
              key={book.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="book">
                <Link to={`/books/${book.id}`} style={{ color: '#fd8496', textDecoration: 'inherit' }}>
                  <p>
                    <span className="normal"><b>{ book.title }</b></span>
                  </p>
                </Link>
              </TableCell>
              <TableCell align="center">{book.id}</TableCell>
              <TableCell align="center">{getAuthorName(book.author_id)}</TableCell>
              <TableCell align="center">{book.author_id}</TableCell>
              <TableCell align="center">{book.pub_year}</TableCell>
              <TableCell align="center">{book.genre}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" onClick={(e) => handleDelete(book.id, e)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Typography variant="caption">Click book's name to update book's information</Typography>
    </Container>
    </div>
  );
}

export default Books;
