import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { BookType, AuthorType, Error } from '../type';
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
  const [book, setBook] = useState<BookType>({ id:`${id}`, title: '', pub_year: '', author_id: '', genre: '' });

  useEffect(() => {
    console.log("Getting data")
    axios.get(`/api/books/${id}`).then((res) => {
      setBook(res.data[0]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/authors').then((res) => {
      setAuthors(res.data);
      setLoading(false);
    });
  }, []);

  let a = authors.find((a: AuthorType) => a.id === book.author_id);
  let n
  if (a) {
    n = a.name;
  } else {
    n = ''
  }
  console.log(n)

  async function update(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.put(`/api/books/${id}`,{
        book: {
          title: title || book.title,
          pub_year: pubYear || book.pub_year,
          genre: genre || book.genre,
          author_id: authorId || book.author_id
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
            id="outlined"
            select
            label="Author"
            variant="outlined"
            defaultValue={n}
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
            id="outlined"
            label="Title"
            defaultValue={book.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="outlined"
            label="Publication Year"
            defaultValue={book.pub_year}
            onChange={(e) => setPubYear(e.target.value)}
          />
          <TextField
            id="outlined"
            label="Genre"
            defaultValue={book.genre}
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
