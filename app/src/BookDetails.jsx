import React, { Component } from 'react';
import { Modal, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const REQUEST_TRADE = gql`
  mutation requestTrade($bookID: String!) {
    requestTrade(bookID: $bookID) {
      status
    }
  }
`;

class BookDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      alertText: ''
    };

    this.toggleAlert = this.toggleAlert.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  toggleAlert(alertText) {
    this.setState({ showAlert: !this.state.showAlert, alertText });
  }

  checkStatus({ requestTrade: { status } }) {
    if (status === 'cannot trade own book') {
      const alertText = 'You cannot trade with yourself';
      this.toggleAlert(alertText);
    } else if (status === 'previous request pending') {
      const alertText = 'You have already requested to trade this book';
      this.toggleAlert(alertText);
    } else {
      const alertText = 'Trade request sent';
      this.toggleAlert(alertText);
      setTimeout(() => { this.props.toggleBookModal(this.props.book); }, 3000);
    }
  }

  render() {
    const alert = this.state.showAlert && (
      <Alert bsStyle='warning'>
        { this.state.alertText }
      </Alert>
    );
    return (
      <Mutation
        mutation={ REQUEST_TRADE }
        onCompleted={ data => { this.checkStatus(data); } }
      >
        { requestTrade => (
          <Modal
            show={ this.props.showBookModal }
            onHide={ () => { this.props.toggleBookModal(this.props.book); } }
          >
            <Modal.Header>Book Details</Modal.Header>
            <Modal.Body>
              <div>
                <span>Title:&nbsp;</span>
                { this.props.book.title }
              </div>
              <div>
                <span>Author:&nbsp;</span>
                { this.props.book.author }
              </div>
              <div>
                <span>Owner:&nbsp;</span>
                { this.props.book.owner.displayName }
              </div>
              { alert }
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup>
                <Button
                  onClick={ () => {
                    if (this.props.user) {
                      requestTrade({ variables: { bookID: this.props.book._id } });
                    } else {
                      const alertText = 'You must be logged in to request a trade';
                      this.toggleAlert(alertText);
                    }
                  } }
                >
                  Request Trade
                </Button>
                <Button
                  onClick={ () => {
                    if (this.state.showAlert) {
                      this.toggleAlert();
                    }
                    this.props.toggleBookModal(this.props.book);
                  } }
                >
                  Close
                </Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
        ) }
      </Mutation>
    );
  }
}

export default BookDetails;
