import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="background-color: #f45d49 nav-class">
        < Link to="/">Home</Link>  |  <Link to="/authors">Authors</Link>  |  <Link to="/books">Books</Link>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;