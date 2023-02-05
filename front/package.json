import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  makeStyles,
} from '@material-ui/core';
import { DataGrid, GridRowParams } from '@mui/x-data-grid';
import { BookType } from '../../src/type';

const useStyles = makeStyles({
  gridContainer: {
    height: '500px',
  },
});

const BookUpdateDelete = () => {
  const [books, setBooks] = useState([] as BookType[]);
  const [selectedBook, setSelectedBook] = useState<BookType>({
    id: '',
    author_id: '',
    pub_year: '',
    title: '',
    genre: '',
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    axios.get('/api/books').then((res) => {
      setBooks(res.data);
      setLoading(false);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateBook = () => {
    try {
      axios
        .put(`/api/books/${selectedBook.id}`, selectedBook)
        .then((res) => {
          const updatedBooks = books.map((b) => {
            if (b.id === selectedBook.id) {
              return res.data;
            }
            return b;
          });
          setBooks(updatedBooks);
          setOpen(false);
          alert(res.data.message);
          window.location.reload();
        });
    } catch (error) {
      let errorObj = error as AxiosError;
      if (errorObj.response === undefined) {
        throw errorObj;
      }
      let { response } = errorObj;
      console.log(response);
    }
  };

  const handleDeleteBook = () => {
    axios.delete(`/api/books/${selectedBook.id}`).then((res) => {
      const updatedBooks = books.filter((b) => b.id !== selectedBook.id);
      setBooks(updatedBooks);
      setOpen(false);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClickOpen = (event: React.MouseEvent, row: BookType) => {
    setSelectedBook(row);
    setOpen(true);
  };

  return (
    <>
      <div className={classes.gridContainer}>
      <DataGrid 
        {...books}
        rows={books}
        columns= {[
          { field: "id", headerName: "ID" },
          { field: "title", headerName: "Title" },
          { field: "author_id", headerName: "Author ID" },
          { field: "pub_year", headerName: "Publication Year" },
          { field: "genre", headerName: "Genre" }
        ]}
        onRowClick={(row, e) => handleClickOpen(e, row)}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update or Delete Book</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={selectedBook.title}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, title: e.target.value })
            }
          />
          <TextField
            label="Author ID"
            value={selectedBook.author_id}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, author_id: e.target.value })
            }
          />
          <TextField
            label="Public Year"
            value={selectedBook.pub_year}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, pub_year: e.target.value })
            }
          />
          <TextField
            label="Genre"
            value={selectedBook.genre}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, genre: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateBook} color="primary">Update</Button>
          <Button onClick={handleDeleteBook} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );  
};
            
export default BookUpdateDelete;
