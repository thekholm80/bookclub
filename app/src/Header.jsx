import React, { Component } from 'react';
import { Modal, ButtonGroup, Button } from 'react-bootstrap';

import './header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: '',
      password: '',
      showModal: true
    };

    this.login = this.login.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  login() {
    // just to make eslint shut up for now:
    this.toggleModal();
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleInputChange({ target: { id, value } }) {
    if (id === 'displayName') {
      this.setState({ displayName: value });
    } else {
      this.setState({ password: value });
    }
  }

  render() {
    return (
      <div className='header'>
        <Modal show={ this.state.showModal } onHide={ this.toggleModal }>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label htmlFor='displayName'>
                Enter Your User Name
                <input
                  id='displayName'
                  type='text'
                  value={ this.state.displayName }
                  onChange={ this.handleInputChange }
                />
              </label>
              <label htmlFor='password'>
                Enter Your Password
                <input
                  id='password'
                  type='text'
                  value={ this.state.password }
                  onChange={ this.handleInputChange }
                />
              </label>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonGroup>
              <Button onClick={ this.login }>Login</Button>
              <Button onClick={ this.toggleModal }>Close</Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal>
        <h3>thekholm80&apos;s Book Trading Club</h3>
        <Button bsSize='small' onClick={ this.toggleModal }>Login</Button>
      </div>
    );
  }
}

export default Header;
