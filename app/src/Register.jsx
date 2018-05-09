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
      repeatPassword: '',
      showAlert: false,
      alertText: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'registerDisplayName') {
      this.setState({ displayName: value });
    } else if (id === 'registerRepeatPassword') {
      this.setState({ repeatPassword: value });
    } else {
      this.setState({ password: value });
    }
  }

  validateSubmit() {
    if (!(this.state.password === this.state.repeatPassword)) {
      this.setState({ showAlert: true, alertText: 'Passwords must match' });
      return false;
    }
    if (this.state.displayName === '' || this.state.password === '' || this.state.repeatPassword === '') {
      this.setState({ showAlert: true, alertText: 'User Name and Password are required' });
      return false;
    }
    return true;
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
                <div className='headerForm-group'>
                  <label htmlFor='registerDisplayName'>User Name</label>
                  <input
                    id='registerDisplayName'
                    type='text'
                    placeholder='User Name'
                    value={ this.state.displayName }
                    onChange={ this.handleInputChange }
                  />
                </div>
                <div className='headerForm-group'>
                  <label htmlFor='registerPassword'>Password</label>
                  <input
                    id='registerPassword'
                    type='password'
                    placeholder='Password'
                    value={ this.state.password }
                    onChange={ this.handleInputChange }
                  />
                </div>
                <div className='headerForm-group'>
                  <label htmlFor='registerRepeatPassword'>Repeat Password</label>
                  <input
                    id='registerRepeatPassword'
                    type='password'
                    placeholder='Repeat Password'
                    value={ this.state.repeatPassword }
                    onChange={ this.handleInputChange }
                  />
                </div>
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
