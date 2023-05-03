import { Box, Button, ButtonVariant, Spinner, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { Permission } from '@/constants/permissions';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const TrialExpiredPage: React.FC = () => {
  const workspace = useActiveWorkspace();
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);

  const [isDowngrading, setIsDowngrading] = React.useState(false);
  const [canUpgradeWorkspace] = usePermission(Permission.CONFIGURE_WORKSPACE);
  const [notifyAdminButtonDisabled, setNotifyAdminButtonDisabled] = React.useState(false);
  const downgradeTrial = useDispatch(Workspace.downgradeTrial);

  const notifyAdmins = async () => {
    toast.success('Admins have been notified');

    await client.identity.workspace.notifyAdmins(workspace!.id);

    setNotifyAdminButtonDisabled(true);
  };

  const onDowngrade = async () => {
    if (!workspace) return;
    setIsDowngrading(true);

    await downgradeTrial(workspace.id);
    toast.success('Successfully downgraded to Free Plan');
  };

  return (
    <S.Container>
      <S.BackgroundContainer />
      <Box.FlexCenter position="fixed" zIndex={9999}>
        <S.UpgradeBox>
          <Box.FlexCenter height="100%" flexDirection="column">
            {isDowngrading ? (
              <Spinner />
            ) : (
              <>
                <S.SvgShadow>
                  <SvgIcon icon="skillTemplate" size={80} />
                </S.SvgShadow>
                <Text fontWeight={600}>Your 14-day Pro trial has expired</Text>
                <Box mt="8px" mb="20px" textAlign="center">
                  <Text color="#132144">Upgrade to Pro, or downgrade to Free to regain full access to your workspace.</Text>
                </Box>
                {canUpgradeWorkspace ? (
                  <S.ButtonsContainer>
                    <Button
                      variant={ButtonVariant.PRIMARY}
                      onClick={() => paymentModal.openVoid({})}
                      fullWidth
                      disabled={paymentModal.closePrevented}
                    >
                      Upgrade to Pro
                    </Button>
                    <Button
                      variant={ButtonVariant.QUATERNARY}
                      squareRadius
                      onClick={onDowngrade}
                      style={{ justifyContent: 'center', display: 'inline-flex' }}
                      fullWidth
                      center
                      disabled={paymentModal.closePrevented || isDowngrading}
                      isLoading={isDowngrading}
                    >
                      Downgrade to Free
                    </Button>
                  </S.ButtonsContainer>
                ) : (
                  <Button variant={ButtonVariant.PRIMARY} onClick={notifyAdmins} disabled={notifyAdminButtonDisabled} fullWidth>
                    Notify workspace admins
                  </Button>
                )}
              </>
            )}
          </Box.FlexCenter>
        </S.UpgradeBox>
      </Box.FlexCenter>
    </S.Container>
  );
};

export default TrialExpiredPage;
