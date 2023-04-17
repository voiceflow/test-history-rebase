import * as Platform from '@voiceflow/platform-config';
import { Modal, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { connect } from 'react-redux';

import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';
import { SourceType } from '@/ducks/tracking/constants';
import { useTrackingEvents } from '@/hooks';

const GOOGLE_SHEETS = 'Google Sheets';

function AddGoogleUserModal({ addUser, user, skill_id, onSuccess, onError, toggle }) {
  const [trackingEvents] = useTrackingEvents();

  const googleLogin = async (userProfile) => {
    try {
      const newUsers = await addUser({
        user_info: userProfile,
        creator_id: user.creator_id,
        skill_id,
      });
      onSuccess(newUsers);
      trackingEvents.trackDeveloperAccountConnected(Platform.Constants.PlatformType.GOOGLE, SourceType.STEP);
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
    <>
      <Modal.Backdrop onClick={toggle} />

      <Modal opened>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={toggle} />}>Connect Google Account</Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-center mt-3">
              <SvgIcon icon="googleSheets" size={42} />
            </div>

            <div className="d-flex justify-content-center">
              <div className="text-muted text-center mt-4 mb-2 mx-5">Log in to connect your account</div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Platform.Google.Components.ConnectButton.Component
            scopes={['profile', 'email', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']}
            onError={onGoogleFailure}
            onSuccess={googleLogin}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  addUser: (body) => Integration.addIntegrationUser(GOOGLE_SHEETS, body),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUserModal);
