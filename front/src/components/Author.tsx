import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Error } from '../../src/type';

function Author() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  async function addAuthor(e: React.FormEvent) {
    e.preventDefault();
    if(name.length === 0 || bio.length === 0) {
      alert('Please fill out all Author fields');
      return;
    }
    try {
      axios.post('/api/authors',{
        author: {
          name: name,
          bio: bio
        }
      }).then((res) => {
        alert(res.data.message);
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
