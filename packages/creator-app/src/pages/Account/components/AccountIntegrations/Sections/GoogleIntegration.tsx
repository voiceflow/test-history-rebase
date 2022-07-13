import { Button, ButtonVariant } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useModals, useSelector } from '@/hooks';
import {
  IntegrationHeader,
  IntegrationInfo,
  IntegrationInfoItem,
  PropName,
} from '@/pages/Account/components/AccountIntegrations/Sections/components';

const GoogleIntegration: React.FC = () => {
  const [googleStatus, setGoogleStatus] = useState(false);
  const user = useSelector(Account.userSelector);
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const unlinkGoogleAccount = useDispatch(Account.google.unlinkAccount);
  const setConfirm = useDispatch(Modal.setConfirm);
  const connectGoogleModal = useModals(ModalType.CONNECT_GOOGLE);

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadGoogleAccount().then(() => setGoogleStatus(true));
  }, []);

  const resetGoogle = () => {
    setConfirm({
      body: 'Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing',
      bodyStyle: { padding: '16px', textAlign: 'center' },
      modalProps: { centered: true, withHeader: false, maxWidth: 300 },
      footerStyle: { justifyContent: 'space-between' },

      confirm: async () => {
        setGoogleStatus(false);

        await unlinkGoogleAccount();

        setGoogleStatus(true);
      },
    });
  };

  const googleButton = () => {
    if (!googleStatus) {
      return (
        <Button variant={ButtonVariant.PRIMARY} squareRadius disabled>
          Loading...
        </Button>
      );
    }
    if (!user.google) {
      return (
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={() => connectGoogleModal.open({ source: SourceType.ACCOUNT_PAGE })}>
          Connect
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={resetGoogle}>
        Reset
      </Button>
    );
  };

  return (
    <div className="card">
      <IntegrationHeader>
        <h5 className="mb-0 font-weight-bold">Google</h5>
        <div className="super-center">{googleButton()}</div>
      </IntegrationHeader>
      {user.google && user.google.profile && (
        <IntegrationInfo>
          <IntegrationInfoItem>
            <PropName> Name: </PropName> {user.google.profile.name}
          </IntegrationInfoItem>
          <IntegrationInfoItem>
            <PropName> Email: </PropName> {user.google.profile.email}
          </IntegrationInfoItem>
          <IntegrationInfoItem>
            <PropName> User Id: </PropName> {user.google.profile.id}
          </IntegrationInfoItem>
        </IntegrationInfo>
      )}
    </div>
  );
};

export default GoogleIntegration;
