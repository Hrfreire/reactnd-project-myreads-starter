import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'
import * as BooksAPI from './BooksAPI';
import BookList from './components/BookList';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
    showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books });
    });
  }

  onClickAdd = () => {
    this.setState({
      showSearchPage: true
    });
  }

  onChangeBookShelf = (book, newShelf) => {
    
    BooksAPI.update(book, newShelf) //update the book on server
      .then(() => { //after the server update, change the state to reflect the update.
        this.setState((prevState) => {
          const books = [ ...prevState.books ]; //clone the book object.
          const bookIndex = books.findIndex(b => b.id === book.id);
          
          if (bookIndex >= 0) { // if book already on list, only changes the shelf.
            books[bookIndex].shelf = newShelf;
          } else { // if book is not on the list yet, add it.
            books.push({ ...book, shelf: newShelf});
          }
    
          return { books };
        });
      })
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : <BookList 
              books={this.state.books}
              onClickAdd={this.onClickAdd}
              onChangeBookShelf={this.onChangeBookShelf}
            />}
      </div>
    )
  }
}

export default BooksApp
