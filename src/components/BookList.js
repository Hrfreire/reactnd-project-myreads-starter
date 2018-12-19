import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';
import MassActionSelect from './MassActionSelect';

class BookList extends Component {

  static propTypes = {
    books: PropTypes.arrayOf(PropTypes.shape({
      shelf: PropTypes.string.isRequired,
    })).isRequired,
    onChangeBookShelf: PropTypes.func.isRequired,
  };

  state = {
    selectedBooks: []
  };

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

  render() {
    const { books, onChangeBookShelf } = this.props;
    const { selectedBooks } = this.state;
    
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div>
          <MassActionSelect
            selectedBooks={selectedBooks}
            onChangeBookShelf={onChangeBookShelf}
            resetSelectedBooks={() => this.setState({ selectedBooks: []})}
          />
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              title="Currently Reading"
              books={books.filter(book => book.shelf === 'currentlyReading')}
              selectedBooks={selectedBooks}
              onChangeBookShelf={onChangeBookShelf}
              onSelectBook={this.onSelectBook}
            />
            <BookShelf
              title="Want to Read"
              books={books.filter(book => book.shelf === 'wantToRead')}
              selectedBooks={selectedBooks}
              onChangeBookShelf={onChangeBookShelf}
              onSelectBook={this.onSelectBook}
            />
            <BookShelf
              title="Read"
              books={books.filter(book => book.shelf === 'read')}
              selectedBooks={selectedBooks}
              onChangeBookShelf={onChangeBookShelf}
              onSelectBook={this.onSelectBook}
            />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}

export default BookList;
