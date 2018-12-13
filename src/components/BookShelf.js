import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

function BookShelf({ title, books, onChangeBookShelf }) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {
            books
              .map(book => (
                <Book
                  key={book.id}
                  book={book}
                  onChangeBookShelf={onChangeBookShelf}
                />
              ))
          }
        </ol>
      </div>
    </div>
  );
}

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default BookShelf;
