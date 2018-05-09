import React, { Component } from 'react';
import { ListGroup, Button } from 'react-bootstrap';

import BookDetails from './BookDetails';

class GlobalBookList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showBookModal: false,
      book: {
        title: '',
        author: '',
        _id: '',
        owner: { displayName: '' }
      }
    };

    this.toggleBookModal = this.toggleBookModal.bind(this);
  }

  toggleBookModal(book) {
    this.setState({ showBookModal: !this.state.showBookModal, book });
  }

  render() {
    return (
      <ListGroup bsClass='list-group fix-width'>
        <BookDetails
          showBookModal={ this.state.showBookModal }
          toggleBookModal={ this.toggleBookModal }
          book={ this.state.book }
          { ...this.props }
        />
        { this.props.data.getAllBooks.map(book => (
          <li key={ book._id }>
            <div>
              <div>
                <span>Title:&nbsp;</span>
                { book.title }
              </div>
              <div>
                <span>Author:&nbsp;</span>
                { book.author }
              </div>
            </div>
            <Button onClick={ () => { this.toggleBookModal(book); } } >
              View Details
            </Button>
          </li>
        )) }
      </ListGroup>
    );
  }
}

export default GlobalBookList;
