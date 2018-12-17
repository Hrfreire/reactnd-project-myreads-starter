import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

class Book extends Component {
  
  state = {
    loading: false
  }

  onChangeBookShelf = (book, shelf) => {
    this.setState({ loading: true});
    this.props.onChangeBookShelf(book, shelf)
      .then(() => this.setState({ loading: false }));
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
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                width: '100%',
                height: '100%',
              }}
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
      smallThumbnail: PropTypes.string.isRequired,
    }).isRequired,
    shelf: PropTypes.string,
  }).isRequired,
  onChangeBookShelf: PropTypes.func.isRequired,
};

export default Book;
