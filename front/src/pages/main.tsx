import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import AllAuthor from "./allAuthor";
import AllBook from "./allBook";

function Main() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Layout />}>
          <Route path="/authors" element={<AllAuthor />} />
          <Route path="/books" element={<AllBook />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Main;