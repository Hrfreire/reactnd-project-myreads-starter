import React from 'react'
import { Route } from 'react-router-dom';
import { message } from 'antd';
import * as BooksAPI from './BooksAPI';
import './App.css'
import BookList from './components/BookList';
import BookSearch from './components/BookSearch';

class BooksApp extends React.Component {
  state = {
    books: [],
    searchedBooks: [],
    loadingBooks: true
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => this.setState({ books, loadingBooks: false }))
      .catch(() => {
        message.error('Failed to load books. Check your internet connection.');
        this.setState({ loadingBooks: false });
      });
  }

  onSearchBooks = (query) => {

    if(query === '') {
      this.setState({ searchedBooks: [] });
      return Promise.resolve();
    }

    return BooksAPI.search(query)
      .then((searchedBooks) => {
        if(searchedBooks instanceof Array) {
          const updatedBooks = this.updateSearchedBooksWithShelves(searchedBooks);
          
          this.setState({ searchedBooks: updatedBooks  });
        } else {
          this.setState({ searchedBooks: [] });
        }
      });
  }

  onChangeBookShelf = (book, newShelf) => {
    
    return BooksAPI.update(book, newShelf) //update the book on server
      .then(() => { //after the server update, change the state to reflect the update.
        this.setState((prevState) => {
          //clone the book array.
          const books = [ ...prevState.books ];
          const searchedBooks = [ ...prevState.searchedBooks ];

          //find indexof book on books
          const bookIndex = books.findIndex(b => b.id === book.id);
          
          let searchedBookIndex = -1;

          //update the shelf on searched book.
          //only is necessary find de searchedBookIndex if searchedBooks > 0
          if(searchedBooks.length > 0){
            searchedBookIndex = searchedBooks.findIndex(b => b.id === book.id);
            searchedBooks[searchedBookIndex].shelf = newShelf;
          }

          //update the books array with the book update.
          if(bookIndex >= 0) {
            if(newShelf === 'none') { //remove book from list if shelf is none
              books.splice(bookIndex, 1);
            } else { //only changes the shelf of the book
              books[bookIndex].shelf = newShelf;
            }
          } 
          // if book is not on the list yet and the shelf is not none, add it.
          else if(newShelf !== 'none') {
            books.push({ ...book, shelf: newShelf});
          }
    
          return { books, searchedBooks };
        });
      })
  }

  updateSearchedBooksWithShelves = (searchedBooks) => {
    //this function sets the shelves of the current books on
    //their copies on searchedBooks
    
    const { books } = this.state;

    const updatedBooks = searchedBooks.map(searchedBook => {
      const book = books.find(b => b.id === searchedBook.id);

      if(book === undefined) {
        return searchedBook;
      }

      return { ...searchedBook, shelf: book.shelf};
    });

    return updatedBooks;
  }

  render() {

    const { searchedBooks, books, selectedBooks, loadingBooks } = this.state;

    return (
      <div className="app">
        <Route 
          path="/search"
          exact
          render={() => {
            return (
              <BookSearch
                books={searchedBooks}
                selectedBooks={selectedBooks}
                onChangeBookShelf={this.onChangeBookShelf}
                onSearchBooks={this.onSearchBooks}
                onSelectBook={this.onSelectBook}
              />
            )
          }}
        />
        <Route 
          path="/"
          exact
          render={() => {
            return (
              <BookList 
                books={books}
                loading={loadingBooks}
                selectedBooks={selectedBooks}
                onChangeBookShelf={this.onChangeBookShelf}
                onSelectBook={this.onSelectBook}
              />
            )
          }}
        />
      </div>
    )
  }
}

export default BooksApp
