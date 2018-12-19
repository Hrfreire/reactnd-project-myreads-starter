import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import Book from './Book';
import MassActionSelect from './MassActionSelect';

class BookSearch extends Component {
  
  static propTypes = {
    onSearchBooks: PropTypes.func.isRequired,
    onChangeBookShelf: PropTypes.func.isRequired,
    books: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired
  };

  state = {
    query: '',
    selectedBooks: [],
    loading: false
  };

  componentWillUnmount() {
    this.props.onSearchBooks('');
  }

  onQueryChange = (query) => {
    this.setState({ query, selectedBooks: [], loading: true });

    this.props.onSearchBooks(query)
      .finally(() => this.setState({ loading: false }));
  }

  onSelectBook = (book) => {
    this.setState((prevState) => {
      const selectedBooks = [ ...prevState.selectedBooks ];
      const bookIndex = selectedBooks.findIndex(b => b.id === book.id);
      
      if(bookIndex !== -1){ //the book is selected, lets uncheck.
        selectedBooks.splice(bookIndex, 1)
        return { selectedBooks };
      }

      //check the book.
      return { selectedBooks: [...selectedBooks, book] };
    });
  }
  
  renderSearchResults = () => {
    const { books, onChangeBookShelf } = this.props;
    const { selectedBooks } = this.state;

    return (
      <React.Fragment>
        {books.length > 0 &&
          <MassActionSelect
              selectedBooks={selectedBooks}
              onChangeBookShelf={onChangeBookShelf}
              resetSelectedBooks={() => this.setState({ selectedBooks: []})}
          />
        }
        <ol className="books-grid">
          { 
            books.map(book => (
              <Book 
                key={book.id }
                book={book}
                onChangeBookShelf={onChangeBookShelf}
                onSelectBook={this.onSelectBook}
                selected={selectedBooks.find(b => b.id === book.id) !== undefined}
              />
            ))
          }
        </ol>
      </React.Fragment>
    )
  }

  renderNoBookFound = () => {
    return (
      <div className="search-no-book-found">
        <span>No book found</span>
      </div>
    )
  }
  
  render() {

    const { books } = this.props;
    const { query, loading } = this.state;

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
              value={query}
              type="text" 
              placeholder="Search by title or author"
              onChange={event => this.onQueryChange(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <div className="search-loading-wrapper">
            <Spin spinning={loading} size="large" />
          </div>
          
          { books.length === 0 && query !== '' && !loading
            ? this.renderNoBookFound()
            : this.renderSearchResults()
          }
        </div>
      </div>
    );
  }
}

export default BookSearch;
