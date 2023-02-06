import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthorType } from '../../src/type';
import { Link } from 'react-router-dom';

function Authors() {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([] as AuthorType[]);

  // use axios to fetch authors from backend
  useEffect(() => {
    console.log("Getting data")
    axios.get('/api/authors').then((res) => {
        setAuthors(res.data);
        setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authors.length === 0) {
    return <div>No authors found</div>;
  }

  return (
    <div className="row">
    <h2 style={{backgroundColor: "lightpink"}}>All Authors</h2>
    <table className="table table-hover table-bordered mt-3">
      <thead>
        <tr>
          <th>Author</th>
          <th>Author ID</th>
          <th>Bio</th>
        </tr>
      </thead>
      <tbody>
          { authors.map((author) => (
            <tr key={author.id}>
              <td>
                <Link to={`/authors/${author.id}`}>
                  <p>
                    <span className="normal">{ author.name }</span>
                  </p>
                </Link>
              </td>
              <td>
                { author.id }
              </td>
              <td> 
                { author.bio }
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    </div>
  );
}

export default Authors;
