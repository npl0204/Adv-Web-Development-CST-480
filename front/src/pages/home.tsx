import { Outlet, Link } from "react-router-dom";

const Home = () => {
  return (<div>
    <h1>Welcome to my page</h1>
    <ul className="header">
      <li>Choose <Link to="/authors">Authors</Link> to see list or all authors or to add an author. </li>
      <li>Choose <Link to="/books">Books</Link> to see list or all books or to add a book. </li>
    </ul>
    <div className="content">
      
    </div>
  </div>)
};

export default Home;