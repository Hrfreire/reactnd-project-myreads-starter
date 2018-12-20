import React, { Component } from 'react';
import { Select, message, Spin } from 'antd';
import PropTypes from 'prop-types';

class MassActionSelect extends Component {
  static propTypes = {
    selectedBooks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    onChangeBookShelf: PropTypes.func.isRequired,
    resetSelectedBooks: PropTypes.func.isRequired,
  };

  state = {
    loading: false
  };

  onSelect = (shelf) => {
    const { selectedBooks, onChangeBookShelf, resetSelectedBooks } = this.props;
    this.setState({ loading: true });

    return Promise.all(selectedBooks.map(book => onChangeBookShelf(book, shelf)))
      .then(() => {
        resetSelectedBooks();
        message.success('All books were successfully updated');
      })
      .catch(() => {
        message.error('Something went wrong updating the books');
      })
      .finally(this.setState({ loading: false }));
  }
  
  render() {
    const { selectedBooks } = this.props;

    return (
      <div className="mass-action-select-wrapper">
        <span className="mass-action-select-text">Mass action</span>
        <Select
          className="mass-action-select"
          size="large"
          disabled={selectedBooks.length === 0}
          value="move"
          onSelect={this.onSelect}
        >
          <Select.Option value="move" disabled>Move to...</Select.Option>
          <Select.Option value="currentlyReading">Currently Reading</Select.Option>
          <Select.Option value="wantToRead">Want to Read</Select.Option>
          <Select.Option value="read">Read</Select.Option>
          <Select.Option value="none">None</Select.Option>
        </Select>
        <Spin size="large" spinning={this.state.loading} style={{ marginLeft: '10px'}}/>
      </div>
    );
  }
}

export default MassActionSelect;
