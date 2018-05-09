import React, { Component } from 'react';
import { Modal, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

/*
  Using { ApolloConsumer } allows query to execute on demand
  rather than firing on load with { Query }
*/

const LOGIN = gql`
  query login($displayName: String!, $password: String!) {
    login(displayName: $displayName, password: $password) {
      status
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      password: '',
      showAlert: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'loginDisplayName') {
      this.setState({ displayName: value });
    } else {
      this.setState({ password: value });
    }
  }

  async handleLogin(client) {
    const { data: { login: { status } } } = await client.query({
      query: LOGIN,
      variables: {
        displayName: this.state.displayName,
        password: this.state.password
      }
    });
    if (status === 'true') {
      this.props.userLogin(this.state.displayName);
    } else {
      this.setState({ showAlert: true });
    }
  }

  render() {
    return (
      <ApolloConsumer>
        { client => (
          <Modal show={ this.props.showLoginModal } onHide={ this.props.toggleLoginModal }>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { this.state.showAlert && (
                <Alert bsStyle='danger'>
                  Invalid user name or password
                </Alert>
              ) }
              <form className='headerForm'>
                <div className='headerForm-group'>
                  <label htmlFor='loginDisplayName'>User Name</label>
                  <input
                    id='loginDisplayName'
                    type='text'
                    placeholder='User Name'
                    value={ this.state.displayName }
                    onChange={ this.handleInputChange }
                  />
                </div>
                <div className='headerForm-group'>
                  <label htmlFor='loginPassword'>Password</label>
                  <input
                    id='loginPassword'
                    type='password'
                    placeholder='Password'
                    value={ this.state.password }
                    onChange={ this.handleInputChange }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup>
                <Button onClick={ () => { this.handleLogin(client); } }>Login</Button>
                <Button onClick={ this.props.toggleLoginModal }>Close</Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
        )}
      </ApolloConsumer>
    );
  }
}

export default Login;
