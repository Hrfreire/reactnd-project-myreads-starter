import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import * as BooksAPI from './BooksAPI';
import BookList from './components/BookList';
import BookSearch from './components/BookSearch';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
    searchedBooks: [],

    showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState({ books });
      });
  }

  onClickAdd = () => {
    this.setState({
      showSearchPage: true,
      searchedBooks: []
    });
  }

  onClickCloseAdd = () => {
    this.setState({
      showSearchPage: false
    });
  }

  onSearchBooks = (query) => {

    if(query === '') {
      this.setState({ searchedBooks: [] });
      return;
    }

    BooksAPI.search(query)
      .then((searchedBooks) => {
        if(searchedBooks instanceof Array) {
          const updatedBooks = this.updateSearchedBooksWithShelfs(searchedBooks);
          
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

  updateSearchedBooksWithShelfs = (searchedBooks) => {
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

    const { searchedBooks, books } = this.state;

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <BookSearch
            books={searchedBooks}
            onChangeBookShelf={this.onChangeBookShelf}
            onSearchBooks={this.onSearchBooks}
            onClickCloseAdd={this.onClickCloseAdd}
          />
        ) : <BookList 
              books={books}
              onClickAdd={this.onClickAdd}
              onChangeBookShelf={this.onChangeBookShelf}
            />}
      </div>
    )
  }
}

export default BooksApp
