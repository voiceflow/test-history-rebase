import React from 'react';
import { Alert } from 'reactstrap';

import Divider from '@/components/Divider';
import PhonePreview from '@/components/PhonePreview';
import Button from '@/componentsV2/Button';
import { SettingsModalConsumer } from '@/containers/CanvasV2/contexts/SettingsModalContext';
import { Settings } from '@/containers/Settings';
import { accountLinkingSelector } from '@/ducks/skill/meta';
import { connect } from '@/hocs';

import Container from './Container';

function AccountLinking({ accountLinking }) {
  return (
    <Container center>
      {accountLinking ? (
        <label>
          <b>{accountLinking.authorizationUrl}</b>
        </label>
      ) : (
        <Alert color="warning" className="mt-2 mb-2 w-100">
          <i className="far fa-exclamation-triangle mr-1" /> No Account Link found
        </Alert>
      )}
      <SettingsModalConsumer>
        {({ toggle: toggleSettings, setType }) => (
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setType(Settings.ADVANCED);
              toggleSettings();
            }}
          >
            Edit Account Linking
          </Button>
        )}
      </SettingsModalConsumer>
      <Divider />
      <div className="px-4 mt-2">
        <label>Send an Account Linking Card to the user's phone/device</label>
      </div>
      <div className="px-5 mt-1">
        <PhonePreview image="/images/account_linking.png" />
      </div>
    </Container>
  );
}

const mapStateToProps = {
  accountLinking: accountLinkingSelector,
};

export default connect(mapStateToProps)(AccountLinking);
