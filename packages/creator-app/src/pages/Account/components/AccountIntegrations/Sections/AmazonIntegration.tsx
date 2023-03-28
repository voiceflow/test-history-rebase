import * as Platform from '@voiceflow/platform-config';
import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const AmazonIntegrations: React.FC = () => {
  const [amazonStatus, setAmazonStatus] = React.useState(false);

  const user = useSelector(Account.userSelector);

  const setConfirm = useDispatch(Modal.setConfirm);
  const loadAmazonAccount = useDispatch(Account.amazon.loadAccount);
  const unlinkAmazonAccount = useDispatch(Account.amazon.unlinkAccount);

  const connectModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  const resetAmazon = () => {
    setConfirm({
      body: 'Resetting your Amazon Account is dangerous and will de-sync all your published assistants/versions and can lead to live skills being deleted. Do not reset unless you know what you are doing',
      bodyStyle: { padding: '16px', textAlign: 'center' },
      modalProps: { centered: true, withHeader: false, maxWidth: 300 },
      footerStyle: { justifyContent: 'space-between' },

      confirm: async () => {
        setAmazonStatus(false);

        await unlinkAmazonAccount();

        setAmazonStatus(true);
      },
    });
  };

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadAmazonAccount().then(() => setAmazonStatus(true));
  }, []);

  const amazonButton = () => {
    if (!amazonStatus) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          Loading...
        </Button>
      );
    }

    if (!user.amazon) {
      return (
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => connectModal.openVoid({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.ALEXA })}
        >
          Connect
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
      <S.IntegrationHeader>
        <h5 className="mb-0 font-weight-bold">Amazon Alexa</h5>

        <div className="super-center">{amazonButton()}</div>
      </S.IntegrationHeader>

      {user.amazon && (
        <S.IntegrationInfo>
          <S.IntegrationInfoItem>
            <S.PropName> Name: </S.PropName> {user.amazon.profile.name}
          </S.IntegrationInfoItem>

          <S.IntegrationInfoItem>
            <S.PropName> Email: </S.PropName> {user.amazon.profile.email}
          </S.IntegrationInfoItem>

          <S.IntegrationInfoItem>
            <S.PropName> User Id: </S.PropName> {user.amazon.profile.user_id}
          </S.IntegrationInfoItem>
        </S.IntegrationInfo>
      )}
    </div>
  );
};

export default AmazonIntegrations;
