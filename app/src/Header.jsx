import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { ApolloConsumer } from 'react-apollo';

import './header.css';

import Login from './Login';
import Register from './Register';
import GetUserInfo from './Queries/GetUserInfo';
import GetPendingRequests from './Queries/GetPendingRequests';
import PendingCount from './PendingCount';
import BookCount from './BookCount';
import RequestCount from './RequestCount';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      showLoginModal: false,
      showRegisterModal: false,
      showProfileModal: false,
      showPendingModal: false
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.toggleProfileModal = this.toggleProfileModal.bind(this);
    this.togglePendingModal = this.togglePendingModal.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  toggleLoginModal() {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  }

  toggleRegisterModal() {
    this.setState({ showRegisterModal: !this.state.showRegisterModal });
  }

  toggleProfileModal() {
    this.setState({ showProfileModal: !this.state.showProfileModal });
  }

  togglePendingModal() {
    this.setState({ showPendingModal: !this.state.showPendingModal });
  }

  userLogin(user) {
    this.setState({
      user,
      showLoginModal: false,
      showRegisterModal: false
    });
  }

  render() {
    const loginRegisterView = this.state.user
      ? (
        <ButtonGroup>
          <Button onClick={ this.toggleProfileModal }>
            Hello, { this.state.user }&nbsp;
          </Button>
          <PendingCount togglePendingModal={ this.togglePendingModal } user={ this.state.user } />
          <RequestCount togglePendingModal={ this.togglePendingModal } user={ this.state.user } />
          <BookCount togglePendingModal={ this.togglePendingModal } user={ this.state.user } />
        </ButtonGroup>
      )
      : (
        <ButtonGroup>
          <Button bsSize='small' onClick={ this.toggleLoginModal }>Login</Button>
          <Button bsSize='small' onClick={ this.toggleRegisterModal }>Register</Button>
        </ButtonGroup>
      );
    return (
      <ApolloConsumer>
        { client => (
          <div className='header'>
            <Login
              toggleLoginModal={ this.toggleLoginModal }
              showLoginModal={ this.state.showLoginModal }
              userLogin={ this.userLogin }
              client={ client }
            />
            <Register
              toggleRegisterModal={ this.toggleRegisterModal }
              showRegisterModal={ this.state.showRegisterModal }
              userLogin={ this.userLogin }
            />
            <GetUserInfo
              toggleProfileModal={ this.toggleProfileModal }
              showProfileModal={ this.state.showProfileModal }
              displayName={ this.state.user }
            />
            <GetPendingRequests
              togglePendingModal={ this.togglePendingModal }
              showPendingModal={ this.state.showPendingModal }
            />
            <h3>thekholm80&apos;s Book Trading Club</h3>
            { loginRegisterView }
          </div>
        ) }
      </ApolloConsumer>
    );
  }
}

export default Header;
