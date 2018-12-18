import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Book from './Book';

class BookSearch extends Component {
  
  static propTypes = {
    onSearchBooks: PropTypes.func.isRequired,
    onChangeBookShelf: PropTypes.func.isRequired,
    books: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
  };

  state = {
    query: ''
  };

  onQueryChange = (query) => {
    this.setState({ query });

    this.props.onSearchBooks(query);
  }

  componentWillUnmount() {
    this.props.onSearchBooks('');
  }
  
  render() {

    const { books, onChangeBookShelf } = this.props;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            className="close-search"
            to="/"
          >
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input 
              value={this.state.query}
              type="text" 
              placeholder="Search by title or author"
              onChange={event => this.onQueryChange(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            { 
              books.map(book => (
                <Book 
                  key={book.id }
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
}

export default BookSearch;
