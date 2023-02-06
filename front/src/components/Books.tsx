import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { BookType, Error } from '../../src/type';
import { Link } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Books() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([] as BookType[]);
  const [searchInput, setSearchInput] = useState("");
  const [sortedBooks, setSortedBook] = useState([] as BookType[]);

  // use axios to fetch books from backend
  useEffect(() => {
    console.log("Getting data")
    axios.get('/api/books').then((res) => {
      setBooks(res.data);
      setSortedBook(sortBooks(res.data));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (books.length === 0) {
    return  <div className="row">
      <h2 style={{backgroundColor: "lightpink"}}>All Books</h2>
      <input
        className="form-control col-12 mt-3 mb-3"
        type="search"
        placeholder="Display all Books Published after Year ..."
        value={searchInput} 
        onChange={handleChangeYear}/>
      <h5 className="alert"> No books found</h5>
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
    <h2 style={{backgroundColor: "lightpink"}}>All Books</h2>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Book</b></TableCell>
            <TableCell align="center"><b>Book ID</b></TableCell>
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
                <Link to={`/books/${book.id}`}>
                  <p>
                    <span className="normal">{ book.title }</span>
                  </p>
                </Link>
              </TableCell>
              <TableCell align="center">{book.id}</TableCell>
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

    {/* <input
      className="form-control col-12 mt-3 mb-3"
      type="search"
      placeholder="Display all Books Published after Year ..."
      value={searchInput} 
      onChange={handleChangeYear}/>
    <table className="table table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Book</th>
          <th>Book ID</th>
          <th>Author ID</th>
          <th>Publication Year</th>
          <th>Genre</th>
        </tr>
      </thead>
      <tbody>
          { sortedBooks.map((book) => (
            <tr key={book.id}>
              <td>
                <Link to={`/books/${book.id}`}>
                  <p>
                    <span className="normal">{ book.title }</span>
                  </p>
                </Link>
              </td>
              <td>
                { book.id } 
              </td>
              <td>
                { book.author_id }
              </td>
              <td> 
                { book.pub_year }
              </td>
              <td> 
                { book.genre }
              </td>
              <td> 
                <IconButton aria-label="delete" onClick={(e) => handleDelete(book.id, e)}>
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
      </tbody>
    </table> */}
    </div>
  );
}

export default Books;
