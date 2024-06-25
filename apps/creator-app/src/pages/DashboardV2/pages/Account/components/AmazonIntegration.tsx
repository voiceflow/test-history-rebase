import * as Platform from '@voiceflow/platform-config';
import { Box, Button, ButtonVariant, SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { SourceType } from '@/ducks/tracking/constants';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const AmazonIntegrations: React.FC = () => {
  const [amazonStatus, setAmazonStatus] = React.useState(false);

  const user = useSelector(Account.userSelector);

  const loadAmazonAccount = useDispatch(Account.amazon.loadAccount);
  const unlinkAmazonAccount = useDispatch(Account.amazon.unlinkAccount);

  const connectModal = ModalsV2.useModal(ModalsV2.Platform.Connect);
  const disconnectModal = ModalsV2.useModal(ModalsV2.Platform.Disconnect);

  const onDisconnect = async () => {
    try {
      await disconnectModal.open({ platform: Platform.Constants.PlatformType.ALEXA });

      setAmazonStatus(false);

      await unlinkAmazonAccount();

      setAmazonStatus(true);
    } catch {
      // modal was closed without confirm
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    loadAmazonAccount().then(() => setAmazonStatus(true));
  }, []);

  const getAmazonButton = () => {
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
          onClick={() =>
            connectModal.openVoid({ source: SourceType.ACCOUNT_PAGE, platform: Platform.Constants.PlatformType.ALEXA })
          }
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
            <SvgIcon icon="amazonAlexa" color="#5FCAF4" size={18} />
          </Box.FlexCenter>

          <Box.FlexAlignStart gap={4} column>
            <SectionV2.Title bold>{user?.amazon?.profile?.email || 'Amazon Alexa'}</SectionV2.Title>

            <SectionV2.Description secondary>
              {user?.amazon?.profile?.user_id || 'Connect Voiceflow with your Amazon Developer Account.'}
            </SectionV2.Description>
          </Box.FlexAlignStart>
        </Box.Flex>

        {getAmazonButton()}
      </Box.FlexApart>
    </SectionV2.SimpleSection>
  );
};

export default AmazonIntegrations;
