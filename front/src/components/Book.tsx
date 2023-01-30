import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

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
interface Error { 
  error: string;
}

function Book() {
  const [authors, setAuthors] = useState([] as Author[])
  const [title, setTitle] = useState('');
  const [pubYear, setPubYear] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
      axios.get('/api/authors').then((res) => {
          setAuthors(res.data);
          setLoading(false);
        });
  }, []);

  async function addBook(e: React.FormEvent) {
    e.preventDefault();
    if(title.length === 0 || pubYear.length === 0 || genre.length === 0 || authorId.length === 0) {
      alert('Please fill out all Book fields');
      return;
    }
    try {
      await axios.post('/api/book',{
        book: {
          title: title,
          pub_year: pubYear,
          genre: genre,
          author_id: authorId
        }
      }).then((res) => {
        alert(res.data.message);
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
  };

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAuthorId(e.target.value);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <h2 style={{backgroundColor: "lightpink"}}>Add a Book</h2>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Author</h5></label>
        <select value={authorId} onChange={handleChange}>
            <option value="">Select an author</option>
        { authors.map((author) => (
            <option key={author.id} value={author.id}>{ author.name }</option>
        ))}
        </select>
      </div>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Title</h5> </label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Publication Year </h5></label>
          <input type="text" value={pubYear} onChange={(e) => setPubYear(e.target.value)} />
      </div>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Genre</h5> </label>
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>
      <div className="row justify-content-center">
        <button className="btn btn-outline-primary mt-3 mb-3 col-1" onClick={addBook}>Add Book</button>
      </div>
    </div>
  )
}

export default Book;
