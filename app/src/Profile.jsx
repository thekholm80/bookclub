import React, { Component } from 'react';
import { Modal, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPDATE_INFO = gql`
  mutation updateUserInfo(
    $firstName: String
    $lastName: String
    $city: String
    $state: String
  ) {
    updateUserInfo(
      firstName: $firstName
      lastName: $lastName
      city: $city
      state: $state
    ) {
      status
    }
  }
`;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      alert: ''
    };

    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateCity = this.updateCity.bind(this);
    this.updateState = this.updateState.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  updateFirstName({ target: { value } }) {
    this.setState({ firstName: value });
  }

  updateLastName({ target: { value } }) {
    this.setState({ lastName: value });
  }

  updateCity({ target: { value } }) {
    this.setState({ city: value });
  }

  updateState({ target: { value } }) {
    this.setState({ state: value });
  }

  checkStatus({ updateUserInfo: { status } }) {
    if (status === 'true') {
      this.setState({ alert: 'Your information has been updated' });
    }
  }

  closeModal() {
    if (this.state.alert) {
      this.setState({ alert: '' });
    }
    this.props.toggleProfileModal();
  }

  render() {
    const alert = (
      <Alert bsStyle='success'>
        { this.state.alert }
      </Alert>
    );
    const firstNameVal = () => (
      this.state.firstName === ''
        ? this.props.data.getUserInfo.firstName
          ? this.props.data.getUserInfo.firstName
          : this.state.firstName
        : this.state.firstName
    );
    const lastNameVal = () => (
      this.state.lastName === ''
        ? this.props.data.getUserInfo.lastName
          ? this.props.data.getUserInfo.lastName
          : this.state.lastName
        : this.state.lastName
    );
    const cityVal = () => (
      this.state.city === ''
        ? this.props.data.getUserInfo.city
          ? this.props.data.getUserInfo.city
          : this.state.city
        : this.state.city
    );
    const stateVal = () => (
      this.state.state === ''
        ? this.props.data.getUserInfo.state
          ? this.props.data.getUserInfo.state
          : this.state.state
        : this.state.state
    );
    return (
      <Mutation mutation={ UPDATE_INFO } onCompleted={ data => { this.checkStatus(data); } }>
        { updateInfo => (
          <Modal show={ this.props.showProfileModal } onHide={ this.props.toggleProfileModal }>
            <Modal.Header>
              Your Information
            </Modal.Header>
            <Modal.Body>
              { this.state.alert && alert }
              <form className='headerForm'>
                <label htmlFor='profileFirstName'>First Name</label>
                <input
                  id='profileFirstName'
                  type='text'
                  placeholder='First Name'
                  value={ firstNameVal() }
                  onChange={ this.updateFirstName }
                />
                <label htmlFor='profileLastName'>Last Name</label>
                <input
                  id='profileLastName'
                  type='text'
                  placeholder='Last Name'
                  value={ lastNameVal() }
                  onChange={ this.updateLastName }
                />
                <label htmlFor='profileCity'>City</label>
                <input
                  id='profileCity'
                  type='text'
                  placeholder='City'
                  value={ cityVal() }
                  onChange={ this.updateCity }
                />
                <label htmlFor='profileState'>State</label>
                <input
                  id='profileState'
                  type='text'
                  placeholder='State'
                  value={ stateVal() }
                  onChange={ this.updateState }
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <ButtonGroup>
                <Button onClick={ () => {
                  const {
                    firstName,
                    lastName,
                    city,
                    state
                  } = this.state;
                  updateInfo({
                    variables: {
                      firstName,
                      lastName,
                      city,
                      state
                    }
                  });
                  } }
                >
                  Update
                </Button>
                <Button onClick={ this.closeModal }>Close</Button>
              </ButtonGroup>
            </Modal.Footer>
          </Modal>
        ) }
      </Mutation>
    );
  }
}

export default Profile;
