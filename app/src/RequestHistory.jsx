import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_HISTORY = gql`
  query getRequestsByOwner {
    getRequestsByOwner{
      requestList {
        tradeId
        book {
          title
          author
          owner {
            displayName
          }
        }
        tradeStatus
      }
      status
    }
  }
`;

const RequestHistory = props => (
  <Modal
    show={ props.showRequestHistoryModal }
    onHide={ props.toggleRequestHistoryModal }
  >
    <Modal.Header>Your Trade Request History</Modal.Header>
    <Modal.Body>
      <ListGroup>
        { props.data.getRequestsByOwner.requestList.map(request => (
          <li key={ request.tradeId }>
            <div>
              <div>Title:&nbsp;{ request.book.title }</div>
              <div>Author:&nbsp;{ request.book.author }</div>
              <div>Owner:&nbsp;{ request.book.owner.displayName }</div>
              <div>Status:&nbsp;{ request.tradeStatus }</div>
            </div>
          </li>
        )) }
      </ListGroup>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={ props.toggleRequestHistoryModal }>Close</Button>
    </Modal.Footer>
  </Modal>
);

const GetRequestHistory = props => (
  <Query
    query={ GET_HISTORY }
    skip={ !props.showRequestHistoryModal }
  >
    { ({ loading, error, data }) => {
      if (loading) return null;
      if (error) return error;
      return (
        <RequestHistory
          { ...props }
          data={ data }
        />
      );
    } }
  </Query>
);

export default GetRequestHistory;
