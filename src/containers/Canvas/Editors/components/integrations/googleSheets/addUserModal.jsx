import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import { GOOGLE_CLIENT_ID } from '@/config';
import { addIntegrationUser } from '@/ducks/integration';

import { GOOGLE_SHEETS } from './constants';

class GoogleAddUserModal extends Component {
  googleLogin = async (userProfile) => {
    const { onBegin, addUser, user, skill_id, onSuccess, onError } = this.props;
    try {
      onBegin();
      const newUsers = await addUser({
        user_info: userProfile,
        creator_id: user.creator_id,
        skill_id,
      });
      onSuccess(newUsers);
    } catch (e) {
      console.error(e);
      let error = e;
      if (e.response && typeof e.response.data === 'string') {
        error = e.response.data;
      } else if (typeof e === 'string') {
        error = e;
      } else if (e.response) {
        error = `Error occured: ${JSON.stringify(e.response.data)}`;
      }
      onError(error);
    }
  };

  onGoogleFailure = async (error) => {
    const { onError } = this.props;

    let message;

    if (error.error === 'idpiframe_initialization_failed') {
      message = 'Seems like you may not have third-party cookies enabled.';
    } else if (error.error === 'popup_closed_by_user') {
      message = 'Pop-up closed before authentication was completed';
    } else if (error.error === 'access_denied') {
      message = 'User denied permissions';
    } else if (error.error === 'immediate_failed') {
      message = 'No user could be automatically selected';
    } else {
      message = 'Unknown error during authentication';
    }

    onError(message);
  };

  render() {
    return (
      <div className="d-flex flex-column">
        <div className="text-center mt-3">
          <img className="add-user-image" src="/google-sheets.svg" alt="empty" />
        </div>
        <div className="d-flex justify-content-center">
          <div className="text-muted text-center mt-4 mb-2 mx-5">Log in to connect your account</div>
        </div>
        <div className="d-flex justify-content-center mx-5 my-3">
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            className="social-button class-ggl mb-4"
            buttonText="Login with Google"
            onSuccess={this.googleLogin}
            onFailure={this.onGoogleFailure}
            responseType="code"
            accessType="offline"
            scope="profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (body) => dispatch(addIntegrationUser(GOOGLE_SHEETS, body)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleAddUserModal);
