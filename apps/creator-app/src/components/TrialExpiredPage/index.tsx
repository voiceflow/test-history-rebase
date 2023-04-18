import { Box, Button, ButtonVariant, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const TrialExpiredPage: React.FC = () => {
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const canUpgradeWorkspace = usePermission(Permission.CONFIGURE_WORKSPACE);
  const [notifyAdminButtonDisabled, setNotifyAdminButtonDisabled] = React.useState(false);

  const notifyAdmins = () => {
    toast.success('Admins have been notified');
    setNotifyAdminButtonDisabled(true);
  };

  return (
    <S.Container>
      <S.BackgroundContainer />
      <Box.FlexCenter position="fixed" zIndex={9999}>
        <S.UpgradeBox>
          <Box.FlexCenter flexDirection="column">
            <S.SvgShadow>
              <SvgIcon icon="skillTemplate" size={80} />
            </S.SvgShadow>
            <Text fontWeight={600}>Your 14-day Pro trial has expired</Text>
            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#132144">Upgrade to Pro, or downgrade to Free to regain full access to your workspace.</Text>
            </Box>
            {canUpgradeWorkspace ? (
              <S.ButtonsContainer>
                <Button variant={ButtonVariant.PRIMARY} onClick={() => paymentModal.openVoid({})} fullWidth>
                  Upgrade to Pro
                </Button>
                <Button variant={ButtonVariant.QUATERNARY} squareRadius onClick={() => paymentModal.openVoid({})} fullWidth>
                  Downgrade to Free
                </Button>
              </S.ButtonsContainer>
            ) : (
              <Button variant={ButtonVariant.PRIMARY} onClick={notifyAdmins} disabled={notifyAdminButtonDisabled}>
                Notify workspace admins
              </Button>
            )}
          </Box.FlexCenter>
        </S.UpgradeBox>
      </Box.FlexCenter>
    </S.Container>
  );
};

export default TrialExpiredPage;
