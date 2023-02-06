import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorType, Error } from '../../src/type';
import { TextField, 
         MenuItem, 
         Button,
         Typography,
         Box 
        } from '@mui/material';
import Container from '@mui/material/Container';

function Book() {
  const [authors, setAuthors] = useState([] as AuthorType[])
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
      await axios.post('/api/books',{
        book: {
          title: title,
          pub_year: pubYear,
          genre: genre,
          author_id: authorId
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
    <Container component="main" sx={{ mt: 0, mb: 5 }} maxWidth="lg">
    <Typography variant="h4" color="lightpink"><b>Add a Book</b></Typography>
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
            select
            label="Author"
            variant="outlined"
            onChange={(e) => setAuthorId(e.target.value)}
          >
            {authors.map((author) => (
              <MenuItem
                key={author.id}
                value={author.id}
              > { author.name }
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            id="outlined-required"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="Publication Year"
            onChange={(e) => setPubYear(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="Genre"
            onChange={(e) => setGenre(e.target.value)}
          />
          <div><Button variant="outlined" onClick={addBook} sx={{ color: '#fd8496' }}>Add Book</Button></div>
      </div>
    </Box>
    </Container>
    </div>
  )
}

export default Book;
