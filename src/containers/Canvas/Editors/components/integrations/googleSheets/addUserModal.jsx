import { devGoogleClient, googleClient } from 'containers/Register/social-id';
import { addIntegrationUser } from 'ducks/integration';
import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';

import { GOOGLE_SHEETS } from './constants';

class GoogleAddUserModal extends Component {
  googleLogin = async (userProfile) => {
    const { onBegin, addUser, user, skill_id, onSuccess, onError } = this.props;
    try {
      onBegin();
      await addUser({
        user_info: userProfile,
        creator_id: user.creator_id,
        skill_id,
      });
      onSuccess();
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
            clientId={process.env.REACT_APP_BUILD_ENV === 'production' ? googleClient : devGoogleClient}
            className="social-button class-ggl mb-4"
            buttonText="Login with Google"
            onSuccess={this.googleLogin}
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
