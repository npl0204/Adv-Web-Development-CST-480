import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { AuthorType, Error } from '../../src/type';
import { Link } from 'react-router-dom';
import { Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';

function Authors() {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([] as AuthorType[]);

  // use axios to fetch authors from backend
  useEffect(() => {
    console.log("Getting data")
    axios.get('/api/authors').then((res) => {
        setAuthors(res.data);
        setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authors.length === 0) {
    return <div>No authors found</div>;
  }

  async function handleDelete(id: any, e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.delete(`/api/authors/${id}`)
      .then((res) => {
        alert("Author was deleted.");
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
  }

  return (
    <div className="row">
    <Container component="main" sx={{ mt: 5, mb: 5 }} maxWidth="lg">
    <Typography variant="h4" color="lightpink"><b>All Author</b></Typography>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <colgroup>
            <col width="15%" />
            <col width="10%" />
            <col width="65%" />
            <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell><b>Author</b></TableCell>
            <TableCell align="center"><b>Author ID</b></TableCell>
            <TableCell align="center"><b>Bio</b></TableCell>
            <TableCell align="center"><b>Delete</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => (
            <TableRow
              key={author.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="author">
                <Link to={`/authors/${author.id}`} style={{ color: '#fd8496', textDecoration: 'inherit' }}>
                  <p>
                    <span className="normal"><b>{ author.name }</b></span>
                  </p>
                </Link>
              </TableCell>
              <TableCell align="center">{author.id}</TableCell>
              <TableCell align="left">{author.bio}</TableCell>
              <TableCell align="center"> 
                <IconButton aria-label="delete" onClick={(e) => handleDelete(author.id, e)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Typography variant="caption">Click author's name to update author's information</Typography>
    </Container>
    </div>
  );
}

export default Authors;
