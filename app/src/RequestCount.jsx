import React from 'react';
import { Button, OverlayTrigger, Badge, Tooltip } from 'react-bootstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_COUNT = gql`
  query getRequestsByOwner {
    getRequestsByOwner {
      requestList {
        tradeId
      }
      status
    }
  }
`;

const toolTip = (
  <Tooltip id='tooltip'>Your Request History</Tooltip>
);

const RequestCount = props => (
  <Button bsStyle="info" onClick={ props.togglePendingModal }>
    <OverlayTrigger placement='left' overlay={ toolTip }>
      <Badge>
        { props.count }
      </Badge>
    </OverlayTrigger>
  </Button>
);

const GetRequestCount = props => (
  <Query
    query={ GET_COUNT }
    skip={ !props.user }
  >
    { ({ loading, error, data }) => {
      if (loading) return <RequestCount { ...props } count='?' />;
      if (error) return error;
      return <RequestCount { ...props } count={ data.getRequestsByOwner.requestList.length } />;
    } }
  </Query>
);

export default GetRequestCount;
