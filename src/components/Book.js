import React from 'react';
import PropTypes from 'prop-types';

function Book({ book, onChangeBookShelf }) {
  const {
    title, authors, imageLinks, shelf,
  } = book;

  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url("${imageLinks.smallThumbnail}")` }} />
          <div className="book-shelf-changer">
            <select
              value={shelf || 'none'}
              onChange={event => onChangeBookShelf(book, event.target.value)}
            >
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{title}</div>
        {
          authors && authors
            .map(name => <div key={name} className="book-authors">{name}</div>)
        }
      </div>
    </li>
  );
}

Book.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string),
    imageLinks: PropTypes.shape({
      smallThumbnail: PropTypes.string.isRequired,
    }).isRequired,
    shelf: PropTypes.string,
  }).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default Book;
