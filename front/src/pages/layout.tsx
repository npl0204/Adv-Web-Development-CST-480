import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <>
      <nav className="background-color: #f45d49 nav-class">
      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> < Link to="/">Home</Link> 
      | <AccountCircleIcon sx={{ mr: 0.5 }} fontSize="inherit" /> <Link to="/authors">Authors</Link>  
      | <AutoStoriesIcon sx={{ mr: 0.5 }} fontSize="inherit" /> <Link to="/books">Books</Link>
      </nav>

      <Outlet />
    </>
  );
}

export default Layout;
