import React, { Component } from 'react';
import { Modal, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const REGISTER = gql`
  mutation register($displayName: String!, $password: String!) {
    register(displayName: $displayName, password: $password) {
      status
    }
  }
`;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      password: '',
      showAlert: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'registerDisplayName') {
      this.setState({ displayName: value });
    } else {
      this.setState({ password: value });
    }
  }

  checkStatus({ register: { status } }) {
    if (status === 'false') {
      this.setState({ showAlert: true });
    } else {
      this.props.userLogin(this.state.displayName);
    }
  }

  render() {
    return (
      <Mutation mutation={ REGISTER } onCompleted={ data => { this.checkStatus(data) } }>
        { (register => (
          <Modal show={ this.props.showRegisterModal } onHide={ this.props.toggleRegisterModal }>
            <Modal.Header closeButton>
              <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { this.state.showAlert && (
                <Alert bsStyle='danger'>
                  User name taken or invalid password
                </Alert>
              ) }
              <form className='headerForm'>
                <input
                  id='registerDisplayName'
                  type='text'
                  placeholder='User Name'
                  value={ this.state.displayName }
                  onChange={ this.handleInputChange }
                />
                <input
                  id='registerPassword'
                  type='password'
                  placeholder='Password'
                  value={ this.state.password }
                  onChange={ this.handleInputChange }
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup>
                <Button onClick={ () => {
                  register({ variables: { displayName: this.state.displayName, password: this.state.password } });
                } }
                >
                  Register
                </Button>
                <Button onClick={ this.props.toggleRegisterModal }>Close</Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
         )) }
      </Mutation>
    );
  }
}

export default Register;
