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
import GetUserBooks from './Queries/GetUserBooks';
import RequestHistory from './RequestHistory';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoginModal: false,
      showRegisterModal: false,
      showProfileModal: false,
      showPendingModal: false,
      showUserBookModal: false,
      showRequestHistoryModal: false
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.toggleProfileModal = this.toggleProfileModal.bind(this);
    this.togglePendingModal = this.togglePendingModal.bind(this);
    this.toggleUserBookModal = this.toggleUserBookModal.bind(this);
    this.toggleRequestHistoryModal = this.toggleRequestHistoryModal.bind(this);
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

  toggleUserBookModal() {
    this.setState({ showUserBookModal: !this.state.showUserBookModal });
  }

  toggleRequestHistoryModal() {
    this.setState({ showRequestHistoryModal: !this.state.showRequestHistoryModal });
  }

  userLogin(user) {
    this.setState({
      showLoginModal: false,
      showRegisterModal: false
    }, this.props.updateUser(user));
  }

  render() {
    const loginRegisterView = this.props.user
      ? (
        <ButtonGroup>
          <Button onClick={ this.toggleProfileModal }>
            Hello, { this.props.user }&nbsp;
          </Button>
          <PendingCount togglePendingModal={ this.togglePendingModal } user={ this.props.user } />
          <RequestCount togglePendingModal={ this.toggleRequestHistoryModal } user={ this.props.user } />
          <BookCount togglePendingModal={ this.toggleUserBookModal } user={ this.props.user } />
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
              displayName={ this.props.user }
            />
            <GetPendingRequests
              togglePendingModal={ this.togglePendingModal }
              showPendingModal={ this.state.showPendingModal }
            />
            <GetUserBooks
              toggleUserBookModal={ this.toggleUserBookModal }
              showUserBookModal={ this.state.showUserBookModal }
              user={ this.props.user }
              globalRefetch={ this.props.globalRefetch }
            />
            <RequestHistory
              toggleRequestHistoryModal={ this.toggleRequestHistoryModal }
              showRequestHistoryModal={ this.state.showRequestHistoryModal }
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
