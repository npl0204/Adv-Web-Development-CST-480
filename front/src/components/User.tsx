import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import {
  TextField,
  Button,
} from '@mui/material';


function User() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Not logged in');

  function login() {
    axios.post('/login', {
      username: username,
      password: password
    }).then((res) => {
      console.log(res.data.message);
      setMessage(res.data.message);
    }).catch((error) => {
      let errorObj = error as AxiosError;
      if (errorObj.response === undefined) {
        throw errorObj;
      }
      let { response } = errorObj;
      console.log(response.data);
    })
  }

  function logout() {
    axios.post('/logout').then((res) => {
      console.log(res.data);
      alert("You have been logged out");
      setMessage(res.data.message);
    })
  }

  return (
    <div>
      <div>
        <h1> { message } </h1>
        <TextField
            required
            id="outlined-required"
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
      </div>
      <div>
        <TextField
            required
            id="outlined-required"
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
      </div>
      <div>
        <div><Button variant="outlined" onClick={login} sx={{ color: '#fd8496' }}>Login</Button></div>
        <div><Button variant="outlined" onClick={logout} sx={{ color: '#fd8496' }}>Logout</Button></div>
      </div>
    </div>
  );
}

export default User;
