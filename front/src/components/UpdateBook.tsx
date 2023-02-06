import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorType, Error } from '../type';
import { useParams, Link } from 'react-router-dom'
import { TextField, 
  MenuItem, 
  Typography,
  Box,
  Button 
 } from '@mui/material';
import Container from '@mui/material/Container';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';

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
    <Link to='/books' style={{ color: '#fd8496', textDecoration: 'inherit' }}>
          <ArrowLeftIcon fontSize="small"/>
          Go back
    </Link>
    <div className="row">
    <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
    <Typography variant="h5" color="lightpink"><b>Update Book</b></Typography>
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
            id="outlined-required"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="Publication Year"
            onChange={(e) => setPubYear(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="Genre"
            onChange={(e) => setGenre(e.target.value)}
          />
          <div><Button variant="outlined" onClick={update} sx={{ color: '#fd8496' }}>Update</Button></div>
      </div>
    </Box>
    </Container>
    </div>
    </>
  );
}

export default UpdateBook;
