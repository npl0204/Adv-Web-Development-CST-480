import { Link } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


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
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography variant="h3" color="lightpink" gutterBottom>
          <b>Welcome to my page</b>
        </Typography>
        <Typography variant="h6" gutterBottom>
          <ul className="header">
            <li>Choose <Link to="/authors" style={{ color: '#fd8496' }}>Authors</Link> to see list or all authors or to add an author. </li>
            <li>Choose <Link to="/books" style={{ color: '#fd8496' }}>Books</Link> to see list or all books or to add a book. </li>
          </ul>
        </Typography>
      </Container>
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
