import React, { Component } from 'react';
import { Button, ButtonGroup, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import './header.css';

import Login from './Login';
import Register from './Register';
import GetUserInfoQuery from './GetUserInfoQuery';

const GET_PENDING_TRADES = gql`
  query getPendingTradesByOwner {
    getPendingTradesByOwner {
      tradeList {
        requestedBy
      }
      status
    }
  }
`;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      showLoginModal: false,
      showRegisterModal: false,
      showProfileModal: false,
      pendingCount: 0
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.toggleProfileModal = this.toggleProfileModal.bind(this);
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

  async userLogin(user, client) {
    const {
      data: {
        getPendingTradesByOwner: {
          status,
          tradeList
        }
      }
    } = await client.query({ query: GET_PENDING_TRADES });
    if (status === 'true') {
      this.setState({
        user,
        showLoginModal: false,
        showRegisterModal: false,
        pendingCount: tradeList.length
      });
    } else {
      this.setState({
        user,
        showLoginModal: false,
        showRegisterModal: false
      });
    }
  }

  render() {
    const toolTip = (
      <Tooltip id='tooltip'>Trade Requests</Tooltip>
    );
    const loginRegisterView = this.state.user
      ? (
        <ButtonGroup>
          <Button onClick={ this.toggleProfileModal }>
            Hello, { this.state.user }&nbsp;
          </Button>
          { this.state.pendingCount > 0 && (
            <Button onClick={ this.toggleProfileModal }>
              <OverlayTrigger placement='left' overlay={ toolTip }>
                <Badge>
                  { this.state.pendingCount }
                </Badge>
              </OverlayTrigger>
            </Button>
          ) }
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
            <GetUserInfoQuery
              toggleProfileModal={ this.toggleProfileModal }
              showProfileModal={ this.state.showProfileModal }
              displayName={ this.state.user }
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
