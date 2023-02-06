import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorType, Error } from '../type';
import { useParams, Link } from 'react-router-dom'

function UpdateBook() {
  const { id } = useParams();
  
  const [authors, setAuthors] = useState([] as AuthorType[]);
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

  async function update(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.put(`/api/books/${id}`,{
        book: {
          title: title,
          pub_year: pubYear,
          genre: genre,
          author_id: authorId
        }
      }).then((res) => {
        alert("Book's information was updated successfully.");
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
  };

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setAuthorId(e.target.value);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
		<Link to='/books'>Go back</Link>
      <div className="row">
        <h2 style={{backgroundColor: "lightpink"}}>Update a Book</h2>
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
          <button className="btn btn-outline-primary mt-3 mb-3 col-1" onClick={update}>Update</button>
        </div>
      </div>
		</>
  )
}

export default UpdateBook;
