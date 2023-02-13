import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme } from '@mui/material/styles';
import { MessageResponse } from '../../src/type';

function User() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Not logged in');
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setToken(token);
      setMessage('Logged in');
      console.log(token);
    }
  }, [token]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    axios.post('/login', {
      username: username,
      password: password
    }).then((res) => {
      const data = res.data;
      localStorage.setItem('token', data.token);
      setMessage(data.message);
      window.location.reload();
    }).catch((error) => {
      let errorObj = error as AxiosError;
      if (errorObj.response === undefined) {
        throw errorObj;
      }
      let { response } = errorObj;
      let data = response.data as MessageResponse;
      alert(data.message);
    })
  }

  function logout(e: React.FormEvent) {
    e.preventDefault();
    axios.post('/logout').then((res) => {
      console.log(res.data);
      alert("You have been logged out");
      setMessage(res.data.message);
      window.location.reload();
    })
    localStorage.removeItem('token');
  }

  if (token.length > 0) {
    return (
      <>
        <Container component="main" sx={{ mt: 5, mb: 5 }} maxWidth="xs">
          <Typography variant="h5" color="lightpink"><b>{ message }</b></Typography>
          <Box textAlign='center'>
            <Button variant="outlined" onClick={logout} sx={{ color: '#fd8496', mt: 3, mb: 2 }}>
            Logout
            </Button>
          </Box>
        </Container>
      </>
    )
  }

  return (
    <>
      <Container component="main" sx={{ mt: 5, mb: 5 }} maxWidth="xs">
        <Typography variant="h5" color="lightpink"><b>{ message }</b></Typography>
        <Box
          component="form"
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
        >
          <Avatar sx={{ m: 1, bgcolor: '#fd8496' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <div>
              <TextField
                margin="normal"
                required
                fullWidth
                id="outlined-required"
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="outlined-required"
                type="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box textAlign='center'>
                <Button variant="outlined" onClick={login} sx={{ color: '#fd8496', mt: 3, mb: 2 }}>
                  Login
                </Button>
              </Box>
              <Grid container>
                <Grid item>
                  <Link to={"/signup"} style={{ color: '#fd8496', textDecoration: 'inherit' }}>
                    <p>
                      <span className="normal">Don't have an account? Sign Up</span>
                    </p>
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default User;
