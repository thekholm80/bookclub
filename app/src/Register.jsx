import React, { Component } from 'react';
import { Modal, ButtonGroup, Button } from 'react-bootstrap';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'registerDisplayName') {
      this.setState({ displayName: value });
    } else {
      this.setState({ password: value });
    }
  }

  render() {
    return (
      <Modal show={ this.props.showRegisterModal } onHide={ this.props.toggleRegisterModal }>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              type='text'
              placeholder='Password'
              value={ this.state.password }
              onChange={ this.handleInputChange }
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button onClick={ this.props.toggleRegisterModal }>Register</Button>
            <Button onClick={ this.props.toggleRegisterModal }>Close</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Register;
