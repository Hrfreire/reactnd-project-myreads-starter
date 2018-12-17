import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';

function BookList({ books, onChangeBookShelf }) {
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf
            title="Currently Reading"
            books={books.filter(book => book.shelf === 'currentlyReading')}
            onChangeBookShelf={onChangeBookShelf}
          />
          <BookShelf
            title="Want to Read"
            books={books.filter(book => book.shelf === 'wantToRead')}
            onChangeBookShelf={onChangeBookShelf}
          />
          <BookShelf
            title="Read"
            books={books.filter(book => book.shelf === 'read')}
            onChangeBookShelf={onChangeBookShelf}
          />
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    shelf: PropTypes.string.isRequired,
  })).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookList;
