import React from 'react';
import { Button, OverlayTrigger, Badge, Tooltip } from 'react-bootstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_COUNT = gql`
  query getBooksByOwner($displayName: String!) {
    getBooksByOwner(displayName: $displayName) {
      title
    }
  }
`;

const toolTip = (
  <Tooltip id='tooltip'>Your Books</Tooltip>
);

const BookCount = props => (
  <Button bsStyle="primary" onClick={ props.togglePendingModal }>
    <OverlayTrigger placement='left' overlay={ toolTip }>
      <Badge>
        { props.count }
      </Badge>
    </OverlayTrigger>
  </Button>
);

const GetBookCount = props => (
  <Query
    query={ GET_COUNT }
    variables={ { displayName: props.user } }
    skip={ !props.user }
  >
    { ({ loading, error, data }) => {
      if (loading) return <BookCount { ...props } count='?' />;
      if (error) return error;
      return <BookCount { ...props } count={ data.getBooksByOwner.length } />;
    } }
  </Query>
);

export default GetBookCount;
