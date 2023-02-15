import { Box, Button, ButtonVariant, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { BackgroundContainer, SvgShadow, UpgradeBox } from './styles';

const TrialExpiredPage: React.FC = () => {
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const canUpgradeWorkspace = usePermission(Permission.CONFIGURE_WORKSPACE);
  const [notifyAdminButtonDisabled, setNotifyAdminButtonDisabled] = React.useState(false);

  const notifyAdmins = () => {
    toast.success('Admins have been notified');
    setNotifyAdminButtonDisabled(true);
  };

  return (
    <>
      <BackgroundContainer />
      <Box.FlexCenter position="fixed" zIndex={999}>
        <UpgradeBox>
          <Box.FlexCenter flexDirection="column">
            <SvgShadow>
              <SvgIcon icon="skillTemplate" size={80} />
            </SvgShadow>
            <Text fontWeight={600}>Your 14-day Pro trial has expired</Text>
            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">Upgrade to Pro, or downgrade to Free to regain full access to your workspace.</Text>
            </Box>
            {canUpgradeWorkspace ? (
              <>
                <Button variant={ButtonVariant.PRIMARY} onClick={() => paymentModal.openVoid({})}>
                  Upgrade to Pro
                </Button>
                <Button variant={ButtonVariant.QUATERNARY} squareRadius onClick={() => paymentModal.openVoid({})}>
                  Downgrade to Free
                </Button>
              </>
            ) : (
              <Button variant={ButtonVariant.PRIMARY} onClick={notifyAdmins} disabled={notifyAdminButtonDisabled}>
                Notify workspace admins
              </Button>
            )}
          </Box.FlexCenter>
        </UpgradeBox>
      </Box.FlexCenter>
    </>
  );
};

export default TrialExpiredPage;
