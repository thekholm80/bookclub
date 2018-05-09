import React, { Component } from 'react';
import { Modal, Button, ButtonGroup, ListGroup } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ACCEPT = gql`
  mutation acceptTrade($tradeId: String!) {
    acceptTrade(tradeId: $tradeId) {
      status
    }
  }
`;

const REJECT = gql`
  mutation rejectTrade($tradeId: String!) {
    rejectTrade(tradeId: $tradeId) {
      status
    }
  }
`;

class PendingRequests extends Component {
  constructor(props) {
    super(props);

    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }

  accept(tradeId, acceptTrade) {
    acceptTrade({ variables: { tradeId } });
    this.props.refetch();
  }

  reject(tradeId, rejectTrade) {
    rejectTrade({ variables: { tradeId } });
    this.props.refetch();
  }

  render() {
    const pendingList = this.props.data.getPendingTradesByOwner.tradeList.map(item => (
      <li key={ item.tradeId }>
        <div>
          <h2>From: { item.requestedBy }</h2>
          <div>Title:&nbsp;</div>
          <h3>{ item.book.title }</h3>
          <div>Author:&nbsp;</div>
          <h3>{ item.book.author }</h3>
        </div>
        <ButtonGroup>
          <Mutation mutation={ ACCEPT } variables={ { tradeId: item.tradeId } }>
            { acceptTrade => (
              <Button onClick={ () => { this.accept(item.tradeId, acceptTrade); } }>Accept</Button>
            ) }
          </Mutation>
          <Mutation mutation={ REJECT } variables={ { tradeId: item.tradeId } }>
            { rejectTrade => (
              <Button onClick={ () => { this.reject(item.tradeId, rejectTrade); } }>Reject</Button>
            ) }
          </Mutation>
        </ButtonGroup>
      </li>
    ));
    return (
      <Modal show={ this.props.showPendingModal } onHide={ this.props.togglePendingModal }>
        <Modal.Header>Pending Trade Requests</Modal.Header>
        <Modal.Body>
          <ListGroup>
            { this.props.data.getPendingTradesByOwner ? pendingList : <li>Nothing to show</li> }
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ this.props.togglePendingModal }>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PendingRequests;
