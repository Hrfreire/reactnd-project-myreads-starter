function getBookMock() {
  const bookMock = {
    book: {
      title: 'Victor Hugo',
      subtitle: 'A Biography',
      authors: [
        'Graham Robb',
      ],
      publisher: 'W. W. Norton & Company',
      publishedDate: '1999',
      imageLinks: {
        smallThumbnail: 'http://books.google.com/books/content?id=kU9LloPylhQC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
        thumbnail: 'http://books.google.com/books/content?id=kU9LloPylhQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      },
      id: 'kU9LloPylhQC',
      shelf: 'read',
    },
    selected: false,
    onChangeBookShelf: (book, shelf) => {
      bookMock.book.shelf = shelf;
      return Promise.resolve(({ ...book, shelf }));
    },
    onSelectBook: (book) => { bookMock.selected = !bookMock.selected; },
  };
  return bookMock;
}

function getBookShelfMock() {
  const bookShelfMock = {
    books: [getBookMock().book],
    selectedBooks: [],
    title: 'Read',
    onChangeBookShelf: () => Promise.resolve(),
    onSelectBook: () => {},
  };
  return bookShelfMock;
}

function getBookListMock() {
  const bookListMock = {
    books: [getBookMock().book],
    loading: false,
    onChangeBookShelf: () => Promise.resolve(),
  };
  return bookListMock;
}

function getBookSearchMock() {
  const booksSearchMock = {
    books: [],
    onSearchBooks: (query) => {
      booksSearchMock.books.push(getBookMock().book);
      return Promise.resolve();
    },
    onChangeBookShelf: () => Promise.resolve(),
  };

  return booksSearchMock;
}

function getMassActionSelectMock() {
  const massActionSelectMock = {
    selectedBooks: [],
    onChangeBookShelf: () => Promise.resolve(),
    resetSelectedBooks: () => { massActionSelectMock.selectedBooks = []; },
  };
  return massActionSelectMock;
}

exports.getBookMock = getBookMock;
exports.getBookShelfMock = getBookShelfMock;
exports.getBookListMock = getBookListMock;
exports.getBookSearchMock = getBookSearchMock;
exports.getMassActionSelectMock = getMassActionSelectMock;
