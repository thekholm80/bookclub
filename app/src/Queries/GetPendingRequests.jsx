import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import PendingRequests from '../PendingRequests';

const GET_PENDING = gql`
  query getPendingTradesByOwner {
    getPendingTradesByOwner {
      tradeList {
        tradeId
        book {
          title
          author
        }
        requestedBy
      }
      status
    }
  }
`;

const GetPendingRequests = props => (
  <Query
    query={ GET_PENDING }
    skip={ !props.showPendingModal }
  >
    { ({ loading, error, data, refetch }) => {
      if (loading) return null;
      if (error) return error;
      return (
        <PendingRequests
          { ...props }
          data={ data }
          refetch={ refetch }
        />
      );
    } }
  </Query>
);

export default GetPendingRequests;
