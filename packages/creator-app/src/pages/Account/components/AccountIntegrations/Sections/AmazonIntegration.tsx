import { Button, ButtonVariant } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { useDispatch, useSelector } from '@/hooks';

const AmazonIntegrations: React.FC = () => {
  const [amazonStatus, setAmazonStatus] = useState(false);
  const user = useSelector(Account.userSelector);
  const loadAmazonAccount = useDispatch(Account.amazon.loadAccount);
  const unlinkAmazonAccount = useDispatch(Account.amazon.unlinkAccount);
  const setConfirm = useDispatch(Modal.setConfirm);

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
        <Button variant={ButtonVariant.PRIMARY} disabled>
          loading...
        </Button>
      );
    }
    if (!user.amazon) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          Unlinked
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.PRIMARY} onClick={resetAmazon}>
        Reset
      </Button>
    );
  };

  return (
    <div className="card">
      <div className={user.amazon ? 'pl-4 pr-4 pt-2 space-between' : 'p-4 space-between'}>
        <h5 className="mb-0 font-weight-bold">Amazon Alexa</h5>
        <div className="super-center">{amazonButton()}</div>
      </div>
      {user.amazon && (
        <>
          <hr />
          <div className="pl-4 pb-4 pr-4 space-between">
            <div className="col-0 font-weight-bold" style={{ color: '#8c94a6' }}>
              <div className="mb-1 mr-2">Name</div>
              <div className="mb-1 mr-2">Email</div>
              <div className="mb-1 mr-2">User Id</div>
            </div>
            <div className="col-sm">
              <div className="mb-1">{user.amazon.profile.name}</div>
              <div className="mb-1">{user.amazon.profile.email}</div>
              <div className="mb-1">{user.amazon.profile.user_id}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AmazonIntegrations;
