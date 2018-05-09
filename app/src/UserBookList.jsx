import React, { Component } from 'react';
import { Modal, ListGroup, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import AddBook from './AddBook';

const REMOVE_BOOK = gql`
  mutation removeBook($bookID: String!) {
    removeBook(bookID: $bookID) {
      status
    }
  }
`;

class UserBookList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      showAlert: false,
      showAddBookModal: false
    };

    this.select = this.select.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.deleteBooks = this.deleteBooks.bind(this);
    this.cancel = this.cancel.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.toggleAddBookModal = this.toggleAddBookModal.bind(this);
  }

  select(id) {
    if (this.state.selected.includes(id)) {
      const newList = [...this.state.selected];
      const i = newList.indexOf(id);
      newList.splice(i, 1);
      this.setState({ selected: newList });
    } else {
      this.setState({ selected: [id, ...this.state.selected] });
    }
  }

  showConfirm() {
    this.setState({ showAlert: true });
  }

  deleteBooks(removeBook) {
    this.state.selected.forEach(bookID => {
      removeBook({ variables: { bookID } });
    });
    this.setState({ selected: [], showAlert: false }, () => {
      this.props.refetch();
      this.props.globalRefetch();
    });
  }

  cancel() {
    this.setState({ showAlert: false });
  }

  clearSelected() {
    this.setState({ selected: [] });
  }

  toggleAddBookModal() {
    this.setState({ showAddBookModal: !this.state.showAddBookModal });
  }

  render() {
    const bookList = this.props.data.getBooksByOwner.map(book => (
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
        <Button
          onClick={ () => { this.select(book._id); } }
          active={ this.state.selected.includes(book._id) }
        >
          Select
        </Button>
      </li>
    ));
    const alert = this.state.showAlert
      ? (
        <Alert bsStyle='danger'>
          <h3>Are you sure?</h3>
          <p>This cannot be undone</p>
          <ButtonGroup>
            <Mutation
              mutation={ REMOVE_BOOK }
            >
              { removeBook => (
                <Button
                  bsStyle='danger'
                  onClick={ () => {
                    this.deleteBooks(removeBook);
                  } }
                >
                  Yes, Delete Selected Book(s)
                </Button>
              ) }
            </Mutation>
            <Button bsStyle='warning' onClick={ this.cancel }>Cancel</Button>
          </ButtonGroup>
        </Alert>
      )
      : null;
    return (
      <Modal show={ this.props.showUserBookModal } onHide={ this.props.toggleUserBookModal }>
        <AddBook
          showAddBookModal={ this.state.showAddBookModal }
          toggleAddBookModal={ this.toggleAddBookModal }
          refetch={ this.props.refetch }
          globalRefetch={ this.props.globalRefetch }
        />
        <Modal.Header>Your Books</Modal.Header>
        <Modal.Body>
          <ListGroup>
            { bookList }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          { alert }
          <ButtonGroup>
            <Button onClick={ this.toggleAddBookModal }>Add Book</Button>
            <Button onClick={ this.clearSelected }>Clear Selected</Button>
            <Button onClick={ this.showConfirm }>Delete Selected</Button>
            <Button onClick={ this.props.toggleUserBookModal }>Close</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UserBookList;
