import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Error } from '../type';
import { useParams, Link } from 'react-router-dom'
import { TextField, 
         MenuItem, 
         Typography,
         Box,
         Button 
        } from '@mui/material';
import Container from '@mui/material/Container';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

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
		<Link to='/authors' style={{ color: '#fd8496', textDecoration: 'inherit' }}>
          <ArrowLeftIcon fontSize="small"/>
          Go back
    </Link>
    <div className="row">
    <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
    <Typography variant="h5" color="lightpink"><b>Update Author</b></Typography>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
          <TextField
            id="outlined-required"
            label="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="Bio"
            onChange={(e) => setBio(e.target.value)}
          />
          <div>
          <Button variant="outlined" onClick={update} sx={{ color: '#fd8496' }}>Update</Button>
          </div>
      </div>
    </Box>
    </Container>
    </div>
		</>
  );
}

export default UpdateAuthor;
