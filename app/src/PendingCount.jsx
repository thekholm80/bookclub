import React from 'react';
import { Button, OverlayTrigger, Badge, Tooltip } from 'react-bootstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_COUNT = gql`
  query getPendingTradesByOwner {
    getPendingTradesByOwner {
      tradeList {
        tradeId
      }
      status
    }
  }
`;

const toolTip = (
  <Tooltip id='tooltip'>Trade Requests</Tooltip>
);

const PendingCount = props => (
  <Button bsStyle="success" onClick={ props.togglePendingModal }>
    <OverlayTrigger placement='left' overlay={ toolTip }>
      <Badge>
        { props.count }
      </Badge>
    </OverlayTrigger>
  </Button>
);

const GetPendingCount = props => (
  <Query
    query={ GET_COUNT }
    skip={ !props.user }
  >
    { ({ loading, error, data }) => {
      if (loading) return null;
      if (error) return error;
      return (
        <PendingCount
          { ...props }
          count={ data.getPendingTradesByOwner.tradeList.length }
        />
      );
    } }
  </Query>
);

export default GetPendingCount;
