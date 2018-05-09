import React, { Component } from 'react';
import { Modal, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_BOOK = gql`
  mutation addBook($title: String! $author: String!) {
    addBook(title: $title, author: $author) {
      status
    }
  }
`;

class AddBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      author: '',
      showAlert: false
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.complete = this.complete.bind(this);
  }

  handleTitleChange({ target: { value } }) {
    this.setState({ title: value });
  }

  handleAuthorChange({ target: { value } }) {
    this.setState({ author: value });
  }

  showAlert() {
    this.setState({ showAlert: true });
  }

  complete() {
    this.setState({ title: '', author: '' }, () => {
      this.props.refetch();
      this.props.toggleAddBookModal();
    });
  }

  render() {
    const alert = this.state.showAlert
      ? (
        <Alert bsStyle='danger'>
          Title And Author Are Required
        </Alert>
      )
      : null;
    return (
      <Mutation
        mutation={ ADD_BOOK }
        onCompleted={ this.complete }
      >
        { addBook => (
          <Modal
            show={ this.props.showAddBookModal }
            onHide={ this.props.toggleAddBookModal }
          >
            <Modal.Header>Add A Book To Your Collection</Modal.Header>
            <Modal.Body>
              { alert }
              <form className='headerForm'>
                <label htmlFor='addBookTitle'>Title</label>
                <input
                  id='addBookTitle'
                  type='text'
                  value={ this.state.title }
                  placeholder='Book Title'
                  onChange={ this.handleTitleChange }
                />
                <label htmlFor='addBookAuthor'>Author</label>
                <input
                  id='addBookAuthor'
                  type='text'
                  value={ this.state.author }
                  placeholder='Book Author'
                  onChange={ this.handleAuthorChange }
                />
                <ButtonGroup>
                  <Button
                    onClick={() => {
                      if (this.state.author && this.state.title) {
                        addBook({
                          variables: {
                            title: this.state.title,
                            author: this.state.author
                          }
                        });
                      } else {
                        this.showAlert();
                      }
                    } }
                  >
                    Submit
                  </Button>
                  <Button onClick={ this.props.toggleAddBookModal }>Cancel</Button>
                </ButtonGroup>
              </form>
            </Modal.Body>
          </Modal>
         ) }
      </Mutation>
    );
  }
}

export default AddBook;
