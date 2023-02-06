import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Error } from '../type';
import { useParams, Link } from 'react-router-dom'
import { TextField,  
         Typography,
         Box,
         Button 
        } from '@mui/material';
import Container from '@mui/material/Container';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { AuthorType } from '../../src/type';

function UpdateAuthor() {
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<AuthorType>({ id:`${id}`, name: '', bio: '' });

  useEffect(() => {
    console.log("Getting data")
    axios.get(`/api/authors/${id}`).then((res) => {
      setAuthor(res.data[0]);
      setLoading(false);
      console.log(res.data);
    });
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

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
            defaultValue={author.name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-required"
            label="Bio"
            defaultValue={author.bio}
            multiline
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
