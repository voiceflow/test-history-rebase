import React from 'react';
import GoogleLogin from 'react-google-login';

import { GOOGLE_CLIENT_ID } from '@/config';
import { userSelector } from '@/ducks/account';
import { addIntegrationUser } from '@/ducks/integration';
import { connect } from '@/hocs/connect';

const GOOGLE_SHEETS = 'Google Sheets';

function AddGoogleUserModal({ addUser, user, skill_id, onSuccess, onError }) {
  const googleLogin = async (userProfile) => {
    try {
      const newUsers = await addUser({
        user_info: userProfile,
        creator_id: user.creator_id,
        skill_id,
      });
      onSuccess(newUsers);
    } catch (err) {
      onError(err);
    }
  };

  const onGoogleFailure = async (error) => {
    let message;
    switch (error.error) {
      case 'idpiframe_initialization_failed':
        message = 'Seems like you may not have third-party cookies enabled.';
        break;
      case 'popup_closed_by_user':
        message = 'Pop-up closed before authentication was completed';
        break;
      case 'access_denied':
        message = 'User denied permissions';
        break;
      case 'immediate_failed':
        message = 'No user could be automatically selected';
        break;
      default:
        message = 'Unknown error during authentication';
    }

    onError(message);
  };

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
          onSuccess={googleLogin}
          onFailure={onGoogleFailure}
          responseType="code"
          accessType="offline"
          scope="profile email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets"
        />
      </div>
    </div>
  );
}

const mapStateToProps = {
  user: userSelector,
};

const mapDispatchToProps = {
  addUser: (body) => addIntegrationUser(GOOGLE_SHEETS, body),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUserModal);
