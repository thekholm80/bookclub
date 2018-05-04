import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import './header.css';

import Login from './Login';
import Register from './Register';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      showLoginModal: false,
      showRegisterModal: false
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  toggleLoginModal() {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  }

  toggleRegisterModal() {
    this.setState({ showRegisterModal: !this.state.showRegisterModal });
  }

  userLogin(user) {
    this.setState({ user, showLoginModal: false, showRegisterModal: false });
  }

  render() {
    const loginRegisterView = this.state.user
      ? <div>Hello, { this.state.user }</div>
      : (
        <ButtonGroup>
          <Button bsSize='small' onClick={ this.toggleLoginModal }>Login</Button>
          <Button bsSize='small' onClick={ this.toggleRegisterModal }>Register</Button>
        </ButtonGroup>
      );
    return (
      <div className='header'>
        <Login
          toggleLoginModal={ this.toggleLoginModal }
          showLoginModal={ this.state.showLoginModal }
          userLogin={ this.userLogin }
        />
        <Register
          toggleRegisterModal={ this.toggleRegisterModal }
          showRegisterModal={ this.state.showRegisterModal }
          userLogin={ this.userLogin }
        />
        <h3>thekholm80&apos;s Book Trading Club</h3>
        { loginRegisterView }
      </div>
    );
  }
}

export default Header;
