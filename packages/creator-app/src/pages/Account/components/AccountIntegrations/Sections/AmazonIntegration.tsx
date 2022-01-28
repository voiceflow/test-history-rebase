import { Button, ButtonVariant } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useModals, useSelector } from '@/hooks';

import { IntegrationHeader, IntegrationInfo, IntegrationInfoItem, PropName } from './components';

const AmazonIntegrations: React.FC = () => {
  const [amazonStatus, setAmazonStatus] = useState(false);
  const user = useSelector(Account.userSelector);
  const loadAmazonAccount = useDispatch(Account.amazon.loadAccount);
  const unlinkAmazonAccount = useDispatch(Account.amazon.unlinkAccount);
  const setConfirm = useDispatch(Modal.setConfirm);
  const connectAmazonModal = useModals(ModalType.CONNECT_AMAZON);

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadAmazonAccount().then(() => setAmazonStatus(true));
  }, []);

  const resetAmazon = () => {
    setConfirm({
      text: (
        <>
          Resetting your Amazon Account is dangerous and will de-sync all your published projects/versions and can lead to live skills being deleted.
          Do not reset unless you know what you are doing
        </>
      ),
      warning: true,
      confirm: async () => {
        setAmazonStatus(false);
        await unlinkAmazonAccount();
        setAmazonStatus(true);
      },
    });
  };

  const amazonButton = () => {
    if (!amazonStatus) {
      return (
        <Button squareRadius variant={ButtonVariant.PRIMARY} disabled>
          Loading...
        </Button>
      );
    }
    if (!user.amazon) {
      return (
        <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={() => connectAmazonModal.open({ source: SourceType.ACCOUNT_PAGE })}>
          Connect
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={resetAmazon}>
        Reset
      </Button>
    );
  };

  return (
    <div className="card">
      <IntegrationHeader>
        <h5 className="mb-0 font-weight-bold">Amazon Alexa</h5>
        <div className="super-center">{amazonButton()}</div>
      </IntegrationHeader>
      {user.amazon && (
        <IntegrationInfo>
          <IntegrationInfoItem>
            <PropName> Name: </PropName> {user.amazon.profile.name}
          </IntegrationInfoItem>
          <IntegrationInfoItem>
            <PropName> Email: </PropName> {user.amazon.profile.email}
          </IntegrationInfoItem>
          <IntegrationInfoItem>
            <PropName> User Id: </PropName> {user.amazon.profile.user_id}
          </IntegrationInfoItem>
        </IntegrationInfo>
      )}
    </div>
  );
};

export default AmazonIntegrations;
