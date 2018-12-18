import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';

class Book extends Component {
  
  state = {
    loading: false
  }

  onChangeBookShelf = (book, shelf) => {
    this.setState({ loading: true});
    
    this.props.onChangeBookShelf(book, shelf)
      .then(() => {
        this.setState({ loading: false });
        message.success(`The book "${book.title}" was successfully updated`);
      }).catch(() => {
        message.error(`Something went wrong updating the book "${book.title}"`)
      });
  }
  
  render() {
    const { book } = this.props;

    const {
      title, authors, imageLinks, shelf,
    } = book;

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <Spin
              size="large"
              spinning={this.state.loading}
              className='book-spin'
            />
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 192,
                backgroundImage:
                `url("${(imageLinks && imageLinks.smallThumbnail)
                  ? imageLinks.smallThumbnail
                  : ''
                }")`,
              }}
            />
            <div className="book-shelf-changer">
              <select
                value={shelf || 'none'}
                onChange={event => this.onChangeBookShelf(book, event.target.value)}
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
}

Book.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string),
    imageLinks: PropTypes.shape({
      smallThumbnail: PropTypes.string,
    }),
    shelf: PropTypes.string,
  }).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default Book;
