import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import AllAuthor from "./allAuthor";
import AllBook from "./allBook";
import UpdateBook from "../components/UpdateBook";
import UpdateAuthor from "../components/UpdateAuthor";
import Signup from "../components/Signup";
import User from "../components/User";

function Main() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="User" element={<User />}/>
        <Route path="Signup" element={<Signup />}/>
        <Route path="/" element={<Layout />}>
          <Route path="/authors" element={<AllAuthor />} />
          <Route path="/authors/:id" element={<UpdateAuthor />}/>
          <Route path="/books" element={<AllBook />} />
          <Route path="/books/:id" element={<UpdateBook />}/>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Main;
