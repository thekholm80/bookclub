import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import UserBookList from '../UserBookList';

const GET_BOOKS = gql`
  query getBooksByOwner($displayName: String!) {
    getBooksByOwner(displayName: $displayName) {
      _id
      title
      author
    }
  }
`;

const GetUserBooks = props => (
  <Query
    query={ GET_BOOKS }
    variables={ { displayName: props.user } }
    skip={ !props.showUserBookModal }
  >
    { ({ loading, error, data, refetch }) => {
      if (loading) return null;
      if (error) return error;
      return (
        <UserBookList
          { ...props }
          data={ data }
          refetch={ refetch }
        />
      );
    } }
  </Query>
);

export default GetUserBooks;
