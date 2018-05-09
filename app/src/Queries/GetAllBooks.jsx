import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Home from '../Home';

const GET_BOOKS = gql`
  query getAllBooks {
    getAllBooks {
      _id
      title
      author
      owner {
        displayName
      }
    }
  }
`;

const GetAllBooks = props => (
  <Query
    query={ GET_BOOKS }
  >
    { ({ loading, error, data, refetch }) => {
      if (loading) return <div>Fetching Books ...</div>;
      if (error) return error;
      return (
        <Home
          { ...props }
          data={ data }
        />
      );
    } }
  </Query>
);

export default GetAllBooks;
