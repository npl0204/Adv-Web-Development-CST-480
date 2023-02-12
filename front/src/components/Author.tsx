import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Error } from '../../src/type';
import { TextField,
         Button,
         Typography,
         Box
        } from '@mui/material';
import Container from '@mui/material/Container';

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
    }
  };

  return (
    <div className="row">
    <Container component="main" sx={{ mt: 5, mb: 5 }} maxWidth="lg">
    <Typography variant="h4" color="lightpink"><b>Add an Author</b></Typography>
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
            required
            id="outlined-required"
            label="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="Bio"
            onChange={(e) => setBio(e.target.value)}
          />
          <div>
          <Button variant="outlined" onClick={addAuthor} sx={{ color: '#fd8496' }}>Add Author</Button>
          </div>
      </div>
    </Box>
    </Container>
    </div>
  )
}

export default Author;
