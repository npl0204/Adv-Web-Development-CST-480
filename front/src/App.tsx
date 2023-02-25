import './App.css';
import Main from './pages/main';

// @ts-ignore
import {Helmet} from "react-helmet";

function App() {
  return (
    <div className="application">
      <Helmet>
        <meta charSet="utf-8" />
        <title>CST480 - Nguyen Phuong Linh</title>
        <link rel="canonical" href="https://hw5.linhpnguyen.com/" />
      </Helmet>
      <Main />
    </div>
  )
}

export default App;
