import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, SectionV2, SvgIcon } from '@voiceflow/ui';
import React, { useEffect, useState } from 'react';

import * as Account from '@/ducks/account';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const GoogleIntegration: React.FC = () => {
  const [googleStatus, setGoogleStatus] = useState(false);
  const user = useSelector(Account.userSelector);
  const loadGoogleAccount = useDispatch(Account.google.loadAccount);
  const unlinkGoogleAccount = useDispatch(Account.google.unlinkAccount);

  const disconnectModal = ModalsV2.useModal(ModalsV2.Platform.Disconnect);
  const connectGoogleModal = ModalsV2.useModal(ModalsV2.Platform.Connect);

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadGoogleAccount().then(() => setGoogleStatus(true));
  }, []);

  const onDisconnect = async () => {
    try {
      await disconnectModal.open({
        title: 'Disconnect Google',
        text: 'Resetting your Google account is potentially dangerous, as it will de-sync all your published assistants & versions. Do not disconnect unless you understand the risk.',
      });
    } catch {
      // modal was closed without confirm
    }
    setGoogleStatus(false);
    await unlinkGoogleAccount();
    setGoogleStatus(true);
  };

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
          onClick={() => connectGoogleModal.openVoid({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.GOOGLE })}
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
