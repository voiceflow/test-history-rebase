import * as Platform from '@voiceflow/platform-config';
import { Button, ButtonVariant } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const GoogleIntegration: React.FC = () => {
  const [googleStatus, setGoogleStatus] = useState(false);
  const user = useSelector(Account.userSelector);
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const unlinkGoogleAccount = useDispatch(Account.google.unlinkAccount);
  const setConfirm = useDispatch(Modal.setConfirm);
  const connectGoogleModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

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
        <Button
          variant={ButtonVariant.PRIMARY}
          squareRadius
          onClick={() => connectGoogleModal.openVoid({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.GOOGLE })}
        >
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
      <S.IntegrationHeader>
        <h5 className="mb-0 font-weight-bold">Google</h5>
        <div className="super-center">{googleButton()}</div>
      </S.IntegrationHeader>
      {user.google && user.google.profile && (
        <S.IntegrationInfo>
          <S.IntegrationInfoItem>
            <S.PropName> Name: </S.PropName> {user.google.profile.name}
          </S.IntegrationInfoItem>
          <S.IntegrationInfoItem>
            <S.PropName> Email: </S.PropName> {user.google.profile.email}
          </S.IntegrationInfoItem>
          <S.IntegrationInfoItem>
            <S.PropName> User Id: </S.PropName> {user.google.profile.id}
          </S.IntegrationInfoItem>
        </S.IntegrationInfo>
      )}
    </div>
  );
};

export default GoogleIntegration;
