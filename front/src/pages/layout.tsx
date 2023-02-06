import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <nav className="background-color: #f45d49 nav-class">
        < Link to="/" style={{ color: '#fd8496', textDecoration: 'inherit' }}>
          <HomeIcon fontSize="small" style={{ color: '#ffe8ec' }}/>
          Home&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Link> 
        <Link to="/authors" style={{ color: '#fd8496', textDecoration: 'inherit' }}>
          <AccountCircleIcon fontSize="small" style={{ color: '#ffe8ec' }}/>
          Authors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Link>      
        <Link to="/books" style={{ color: '#fd8496', textDecoration: 'inherit' }}>
          <AutoStoriesIcon fontSize="small" style={{ color: '#ffe8ec' }}/>
          Books&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </Link>
      </nav>

      <Outlet />
    </div>
  );
}

export default Layout;
