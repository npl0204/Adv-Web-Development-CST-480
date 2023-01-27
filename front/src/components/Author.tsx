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

function Author() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get('/api/books').then((res) => {
          //setBooks(res.data);
          setLoading(false);
        });
  }, []);

  async function addAuthor(e: React.FormEvent) {
    e.preventDefault();
    if(name.length === 0 || bio.length === 0) {
      alert('Please fill out all Author fields');
      return;
    }
    try {
      await axios.post('/api/author',{
        author: {
          name: name,
          bio: bio
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

  // function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
  //   setAuthorId(e.target.value);
  // }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <h2 style={{backgroundColor: "lightpink"}}>Add an Author</h2>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Name</h5> </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      <div className="d-flex mt-1 justify-content-between col-6">
        <label> <h5>Bio </h5></label>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="row justify-content-center">
        <button className="btn btn-outline-primary mt-3 col-1" onClick={addAuthor}>Add Author</button>
      </div>
    </div>
  )
}

export default Author;
