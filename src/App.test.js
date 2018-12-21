/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Checkbox, Select } from 'antd';

import App from './App';
import Book from './components/Book';
import BookShelf from './components/BookShelf';
import BookList from './components/BookList';
import BookSearch from './components/BookSearch';
import MassActionSelect from './components/MassActionSelect';

import {
  getBookMock, getBookShelfMock, getBookListMock, getBookSearchMock, getMassActionSelectMock,
} from './MockTest';

const mockBooks = getBookListMock().books;
jest.mock('./BooksAPI', () => ({
  search: () => Promise.resolve(mockBooks),
  getAll:() => Promise.resolve(mockBooks),
  update: (book, shelf) => Promise.resolve({ ...book, shelf })
}));

enzyme.configure({ adapter: new Adapter() });

/**
 This course is not designed to teach Test Driven Development.
 Feel free to use this file to test your application, but it
 is not required.
* */

// App Component

it('App - renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    div,
  );
});

it('App - load BookList and BookSearch Correctly', () => {
  const routerComponent = shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  const appComponent = routerComponent.find(App).dive();
  expect(typeof appComponent.find(BookList)).toBe('object')
  expect(typeof appComponent.find(BookSearch)).toBe('object');
});

it('App - updateSearchedBooksWithShelves update shelves correctly', () => {
  const bookListMock = getBookListMock();
  bookListMock.books[0].shelf = 'read';
  
  const searchedBooks = bookListMock.books.map(book => ({ ...book }));
  searchedBooks[0].shelf = undefined;
  
  const app = shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  ).find(App).dive();
  app.setState({ books: bookListMock.books });

  const updatedBooks = app.instance().updateSearchedBooksWithShelves(searchedBooks);
  expect(updatedBooks[0].shelf).toBe('read');
});

it('App - onSearchBooks search correctly', () => {
  const app = shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  ).find(App).dive();
  
  return app.instance()
    .onSearchBooks('query')
    .then(() => {
      expect(app.state('searchedBooks').length).toBeGreaterThan(0);
    });
});

it('App - onChangeBookShelf changes book shelf correctly', () => {
  const app = shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  ).find(App).dive();

  const book = getBookMock().book;
  app.setState({ books: [ { ...book }]})

  return app.instance().
    onChangeBookShelf(book, 'wantToRead')
    .then(() => {
      expect(app.state('books')[0].shelf).toBe('wantToRead');
    });
});

it('App - onChangeBookShelf changes book shelf to none removes book from books array', () => {
  const app = shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  ).find(App).dive();

  const book = getBookMock().book;
  app.setState({ books: [ { ...book }]})

  return app.instance().
    onChangeBookShelf(book, 'none')
    .then(() => {
      expect(app.state('books').length).toBe(0);
    });
});

// Book Component Test

it('Book - loads with no shelf', () => {
  const bookMock = getBookMock();
  bookMock.book.shelf = undefined;

  const bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find('select').prop('value')).toEqual('none');
});

it('Book - loads with no image', () => {
  const bookMock = getBookMock();
  bookMock.book.imageLinks = undefined;

  const bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find('.book-cover').prop('style').backgroundImage).toEqual('url("")');
});


it('Book - changes shelf correctly', () => {
  const bookMock = getBookMock();
  bookMock.book.shelf = 'read';

  let bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find('select').prop('value')).toEqual('read');

  bookComponent.find('select')
    .simulate('change', { target: { value: 'currentlyReading' } });

  bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find('select').prop('value')).toEqual('currentlyReading');
});

it('Book - checkbox works correctly', () => {
  const bookMock = getBookMock();
  bookMock.selected = false;

  let bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find(Checkbox).prop('checked')).toEqual(false);

  bookComponent.find(Checkbox).simulate('change');

  bookComponent = shallow(<Book {...bookMock} />);
  expect(bookComponent.find(Checkbox).prop('checked')).toEqual(true);
});

// BookShelf Component

it('BookShelf - loads correctly', () => {
  const bookShelfMock = getBookShelfMock();
  mount(<BookShelf {...bookShelfMock} />);
});

it('BookShelf - loads correctly with selected books', () => {
  const bookShelfMock = getBookShelfMock();
  bookShelfMock.selectedBooks.push(getBookMock().book);
  mount(<BookShelf {...bookShelfMock} />);
});

// BookList Component

it('BookList - loads correctly', () => {
  const bookListMock = getBookListMock();
  mount(
    <BrowserRouter>
      <BookList {...bookListMock} />
    </BrowserRouter>,
  );
});

it('BookList - book selection works correctly', () => {
  const bookListMock = getBookListMock();
  const broswerRouter = shallow(
    <BrowserRouter>
      <BookList {...bookListMock} />
    </BrowserRouter>,
  );

  const bookList = broswerRouter.find(BookList).dive();
  expect(bookList.state('selectedBooks').length).toEqual(0);

  bookList.instance().onSelectBook(bookListMock.books[0]);

  expect(bookList.state('selectedBooks').length).toEqual(1);
});

it('BookList - book unselection works correctly', () => {
  const bookListMock = getBookListMock();
  const broswerRouter = shallow(
    <BrowserRouter>
      <BookList {...bookListMock} />
    </BrowserRouter>,
  );
  const bookList = broswerRouter.find(BookList).dive();
  bookList.setState({ selectedBooks: [bookListMock.books[0]] });

  expect(bookList.state('selectedBooks').length).toEqual(1);

  bookList.instance().onSelectBook(bookListMock.books[0]);

  expect(bookList.state('selectedBooks').length).toEqual(0);
});

// BookSearch Component

it('BookSearch - book search works correctly', () => {
  const bookSearchMock = getBookSearchMock();
  let broswerRouter = shallow(
    <BrowserRouter>
      <BookSearch {...bookSearchMock} />
    </BrowserRouter>,
  );
  bookSearchMock.books = [];
  let bookSearch = broswerRouter.find(BookSearch);

  expect(bookSearch.prop('books').length).toEqual(0);

  bookSearch.dive().instance().onQueryChange('book');

  broswerRouter = shallow(
    <BrowserRouter>
      <BookSearch {...bookSearchMock} />
    </BrowserRouter>,
  );
  bookSearch = broswerRouter.find(BookSearch);

  expect(bookSearch.prop('books').length).toEqual(bookSearchMock.books.length);
});

it('BookSearch- book selection works correctly', () => {
  const bookSearchMock = getBookSearchMock();
  bookSearchMock.books = [getBookMock().book];
  const broswerRouter = shallow(
    <BrowserRouter>
      <BookSearch {...bookSearchMock} />
    </BrowserRouter>,
  );

  const bookSearch = broswerRouter.find(BookSearch).dive();
  bookSearch.setState({ selectedBooks: [bookSearchMock.books[0]] });

  expect(bookSearch.state('selectedBooks').length).toEqual(1);

  bookSearch.instance().onSelectBook(bookSearchMock.books[0]);

  expect(bookSearch.state('selectedBooks').length).toEqual(0);
});


it('BookSearch- book unselection works correctly', () => {
  const bookSearchMock = getBookSearchMock();
  bookSearchMock.books = [getBookMock().book];
  const broswerRouter = shallow(
    <BrowserRouter>
      <BookSearch {...bookSearchMock} />
    </BrowserRouter>,
  );

  const bookSearch = broswerRouter.find(BookSearch).dive();
  expect(bookSearch.state('selectedBooks').length).toEqual(0);

  bookSearch.instance().onSelectBook(bookSearchMock.books[0]);

  expect(bookSearch.state('selectedBooks').length).toEqual(1);
});


// MassActionSelect Component

it('MassActionSelect - Select is disabled if selectedBooks is empty', () => {
  const massActionSelectMock = getMassActionSelectMock();
  massActionSelectMock.selectedBooks = [];

  const massActionSelect = shallow(
    <MassActionSelect {...massActionSelectMock} />,
  );

  expect(massActionSelect.find(Select).prop('disabled')).toEqual(true);
});

it('MassActionSelect - Select is enabled if selectedBooks is not empty', () => {
  const massActionSelectMock = getMassActionSelectMock();
  massActionSelectMock.selectedBooks = [getBookMock().book];

  const massActionSelect = shallow(
    <MassActionSelect {...massActionSelectMock} />,
  );

  expect(massActionSelect.find(Select).prop('disabled')).toEqual(false);
});

it('MassActionSelect - The selectedBooks is cleared after selection', () => {
  const massActionSelectMock = getMassActionSelectMock();
  massActionSelectMock.selectedBooks = [getBookMock().book];

  let massActionSelect = shallow(
    <MassActionSelect {...massActionSelectMock} />,
  );

  return massActionSelect.instance().onSelect('read')
    .then(() => {
      massActionSelect = shallow(
        <MassActionSelect {...massActionSelectMock} />,
      );
    
      expect(massActionSelect.instance().props.selectedBooks.length).toEqual(0);
    });
});
