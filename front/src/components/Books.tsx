import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TODO: Create a type.d.ts file and move this interface there
// Then, import it here

interface Author {
  id: string;
  name: string;
  bio: string;
}
interface Book {
  id: string;
  author_id: string;
  title: string;
  pub_year: string;
  genre: string;
}

function Books() {
  //const [authors, setAuthors] = useState([] as Author[])
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([] as Book[]);

  // use axios to fetch books from backend
  useEffect(() => {
    console.log("Getting data")
    axios.get('/api/books').then((res) => {
        setBooks(res.data);
        setLoading(false);
    });
    // axios.get('/api/authors').then((res) => {
    //   setAuthors(res.data);
    //   setLoading(false);
    // });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (books.length === 0) {
    return <div>No books found</div>;
  }
  let books_sorted = books.sort(function(a,b){
    return a.title.localeCompare(b.title);
  })
  return (
    <div className="row">
    <h2 style={{backgroundColor: "lightpink"}}>All Books</h2>
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
          { books_sorted.map((book) => (
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
