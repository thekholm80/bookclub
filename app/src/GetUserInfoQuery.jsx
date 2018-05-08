import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Profile from './Profile';

const GET_INFO = gql`
  query getUserInfo($displayName: String!) {
    getUserInfo(displayName: $displayName) {
      firstName
      lastName
      city
      state
    }
  }
`;

const GetUserInfoQuery = props => (
  <Query
    query={ GET_INFO }
    variables={ { displayName: props.displayName } }
    skip={ !props.displayName }
  >
    { ({ loading, error, data }) => {
      if (loading) return null;
      if (error) return error;
      return (
        <Profile
          toggleProfileModal={ props.toggleProfileModal }
          showProfileModal={ props.showProfileModal }
          displayName={ props.displayName }
          data={ data }
        />
      );
    } }
  </Query>
);

export default GetUserInfoQuery;
