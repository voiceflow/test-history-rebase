import { Button, ButtonVariant } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useModals, useSelector } from '@/hooks';

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
      text: (
        <>Resetting your Google Account is dangerous and will de-sync all your published projects. Do not reset unless you know what you are doing</>
      ),
      warning: true,
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
        <Button variant={ButtonVariant.PRIMARY} disabled>
          loading...
        </Button>
      );
    }
    if (!user.google) {
      return (
        <Button variant={ButtonVariant.PRIMARY} onClick={() => connectGoogleModal.open({ source: SourceType.ACCOUNT_PAGE })}>
          Connect
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} onClick={resetGoogle}>
        Reset
      </Button>
    );
  };

  return (
    <div className="card">
      <div className="pl-4 pr-4 pt-2 pb-2 space-between mb-0">
        <h5 className="mb-0 font-weight-bold">Google</h5>
        <div className="super-center">{googleButton()}</div>
      </div>
      {user.google && user.google.profile && (
        <>
          <hr />
          <div className="pl-4 pb-4 pr-4 space-between">
            <div className="col-0 font-weight-bold" style={{ color: '#8c94a6' }}>
              <div className="mb-1 mr-2">Name</div>
              <div className="mb-1 mr-2">Email</div>
              <div className="mb-1 mr-2">User Id</div>
            </div>
            <div className="col-sm">
              <div className="mb-1">{user.google.profile.name}</div>
              <div className="mb-1">{user.google.profile.email}</div>
              <div className="mb-1">{user.google.profile.id}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleIntegration;
