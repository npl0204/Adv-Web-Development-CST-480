import { Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import User from '../components/User';
import { Divider } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 5, mb: 5 }} maxWidth="sm">
        <Typography variant="h3" color="lightpink" gutterBottom>
          <b>Welcome to my page</b>
        </Typography>
        <Typography variant="h6" gutterBottom>
          <ul className="header">
            <li>Choose <Link to="/authors" style={{ color: '#fd8496' }}>Authors</Link> to see list or all authors. </li>
            <li>Choose <Link to="/books" style={{ color: '#fd8496' }}>Books</Link> to see list or all books. </li>
            <li>Log in to add, update, or delete book/author lists. </li>
          </ul>
          <User />
        </Typography>
      </Container>
      <Divider />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            Linh Nguyen - CS T480
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
