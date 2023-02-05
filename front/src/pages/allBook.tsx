import Books from '../components/Books';
import Book from '../components/Book';
import BookUpdateDelete from '../components/BookUpdateDelete';

function AllBook() {
  return (
    <div className="container">
      <Books />
      <Book/>
      <BookUpdateDelete/>
    </div>
  )
}

export default AllBook;
