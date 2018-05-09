import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './App.css';

import Header from './Header';
import Home from './Home';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: ''
    };

    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(user) {
    this.setState({ user });
  }

  render() {
    return (
      <div className='app'>
        <Header
          user={ this.state.user }
          updateUser={ this.updateUser }
          globalRefetch={ this.props.globalRefetch }
        />
        <Home
          user={ this.state.user }
          { ...this.props }
        />
      </div>
    );
  }
}

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
        <App
          { ...props }
          data={ data }
          globalRefetch={ refetch }
        />
      );
    } }
  </Query>
);

export default GetAllBooks;
