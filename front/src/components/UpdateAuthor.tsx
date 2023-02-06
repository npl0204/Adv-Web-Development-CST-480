import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Error } from '../type';
import { useParams, Link } from 'react-router-dom'

function UpdateAuthor() {
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  // const [loading, setLoading] = useState(true);

  async function update(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.put(`/api/authors/${id}`,{
        author: {
          name: name,
          bio: bio
        }
      }).then((res) => {
        alert("Author's information was updated successfully.");
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

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
		<Link to='/authors'>Go back</Link>
      <div className="row">
        <h2 style={{backgroundColor: "lightpink"}}>Update an Author</h2>
        <div className="d-flex mt-1 justify-content-between col-6">
          <label> <h5>Name</h5> </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        <div className="d-flex mt-1 justify-content-between col-6">
          <label> <h5>Bio</h5></label>
            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="row justify-content-center">
          <button className="btn btn-outline-primary mt-3 mb-3 col-1" onClick={update}>Update</button>
        </div>
      </div>
		</>
  )
}

export default UpdateAuthor;
