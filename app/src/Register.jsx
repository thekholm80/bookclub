import React, { Component } from 'react';
import { Modal, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

/**
  TODO:

  Have server register mutation set cookie so login
  is not required after register
*/

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
      showAlert: false,
      alertText: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
    this.showValidationError = this.showValidationError.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'registerDisplayName') {
      this.setState({ displayName: value });
    } else {
      this.setState({ password: value });
    }
  }

  validateSubmit() {
    return this.state.displayName !== '' && this.state.password !== '';
  }

  showValidationError() {
    this.setState({ showAlert: true, alertText: 'User Name and Password are required' });
  }

  checkStatus({ register: { status } }) {
    if (status === 'false') {
      this.setState({ showAlert: true, alertText: 'User Name is taken' });
    } else {
      this.props.toggleRegisterModal();
    }
  }

  render() {
    return (
      <Mutation mutation={ REGISTER } onCompleted={ data => { this.checkStatus(data); } }>
        { (register => (
          <Modal show={ this.props.showRegisterModal } onHide={ this.props.toggleRegisterModal }>
            <Modal.Header closeButton>
              <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { this.state.showAlert && (
                <Alert bsStyle='danger'>
                  { this.state.alertText }
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
                  if (this.validateSubmit()) {
                    register({
                      variables: {
                        displayName: this.state.displayName,
                        password: this.state.password
                      }
                    });
                  } else {
                    this.showValidationError();
                  }
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
