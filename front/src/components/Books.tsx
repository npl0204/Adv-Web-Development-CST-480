import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Author from './Author';
import { BookType } from '../../src/type';

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

  return (
    <div className="row">
    <h2 style={{backgroundColor: "lightpink"}}>All Books</h2>
    <input
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
                <a href={`/api/books/${book.id}`}>{ book.title }</a>
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
            </tr>
          ))}
      </tbody>
    </table>
    </div>
  );
}

export default Books;
