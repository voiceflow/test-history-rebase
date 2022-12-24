import * as Platform from '@voiceflow/platform-config';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import GoogleLoginButton from '@/components/Forms/GoogleLogin';
import { GOOGLE_SPREADSHEETS_INTEGRATION_SCOPES } from '@/constants';
import * as Account from '@/ducks/account';
import * as Integration from '@/ducks/integration';
import { SourceType } from '@/ducks/tracking/constants';
import { connect } from '@/hocs/connect';
import { useTrackingEvents } from '@/hooks';

const GOOGLE_SHEETS = 'Google Sheets';

function AddGoogleUserModal({ addUser, user, skill_id, onSuccess, onError }) {
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
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center mt-3">
        <SvgIcon icon="googleSheets" size={42} />
      </div>
      <div className="d-flex justify-content-center">
        <div className="text-muted text-center mt-4 mb-2 mx-5">Log in to connect your account</div>
      </div>
      <div className="d-flex justify-content-center mx-5 my-3">
        <GoogleLoginButton scopes={GOOGLE_SPREADSHEETS_INTEGRATION_SCOPES} onFail={onGoogleFailure} onSuccess={googleLogin} skipLinkGoogleAccount />
      </div>
    </div>
  );
}

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  addUser: (body) => Integration.addIntegrationUser(GOOGLE_SHEETS, body),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleUserModal);
