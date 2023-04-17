import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const GoogleIntegration: React.FC = () => {
  const [googleStatus, setGoogleStatus] = React.useState(false);

  const user = useSelector(Account.userSelector);

  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const unlinkGoogleAccount = useDispatch(Account.google.unlinkAccount);

  const connectModal = ModalsV2.useModal(ModalsV2.Platform.Connect);
  const disconnectModal = ModalsV2.useModal(ModalsV2.Platform.Disconnect);

  const onDisconnect = async () => {
    try {
      await disconnectModal.open({ platform: Platform.Constants.PlatformType.GOOGLE });

      setGoogleStatus(false);

      await unlinkGoogleAccount();

      setGoogleStatus(true);
    } catch {
      // modal was closed without confirm
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadGoogleAccount().then(() => setGoogleStatus(true));
  }, []);

  const getGoogleButton = () => {
    if (!googleStatus) {
      return (
        <Button variant={ButtonVariant.PRIMARY} disabled>
          Loading...
        </Button>
      );
    }
    if (!user.google) {
      return (
        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={() => connectModal.openVoid({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.GOOGLE })}
        >
          Connect
        </Button>
      );
    }
    return (
      <Button variant={ButtonVariant.SECONDARY} onClick={onDisconnect}>
        Disconnect
      </Button>
    );
  };

  return (
    <SectionV2.SimpleSection headerProps={{ topUnit: 3, bottomUnit: 3 }}>
      <Box.FlexApart fullWidth>
        <Box.Flex gap={16}>
          <Box.FlexCenter backgroundColor="#EEF4F6" borderRadius={8} width={42} height={42}>
            <SvgIcon icon="google" size={42} />
          </Box.FlexCenter>

          <Box.FlexAlignStart gap={4} column>
            <SectionV2.Title bold>{user?.google?.profile?.email || 'Google'}</SectionV2.Title>
            <SectionV2.Description secondary>{user?.google?.profile?.id || 'Connect Voiceflow to your Google account.'}</SectionV2.Description>
          </Box.FlexAlignStart>
        </Box.Flex>

        {getGoogleButton()}
      </Box.FlexApart>
    </SectionV2.SimpleSection>
  );
};

export default GoogleIntegration;
