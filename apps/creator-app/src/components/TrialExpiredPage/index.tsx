import { UserRole } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Spinner, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useSelector } from '@/hooks';
import { useTrackingEvents } from '@/hooks/tracking';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const TrialExpiredPage: React.FC = () => {
  const workspace = useActiveWorkspace();
  const userRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const [trackEvents] = useTrackingEvents();

  const [isDowngrading, setIsDowngrading] = React.useState(false);

  const [notifyAdminButtonDisabled, setNotifyAdminButtonDisabled] = React.useState(false);
  const downgradeTrial = useDispatch(Workspace.downgradeTrial);

  const canUpgradeWorkspace = React.useMemo(() => {
    /**
     * When trials expires, all users are downgraded to viewers in the permission system.
     * So we need to check their member role to see if they can upgrade the workspace.
     */
    return userRole && [UserRole.ADMIN, UserRole.OWNER, UserRole.BILLING].includes(userRole);
  }, [userRole]);

  const notifyAdmins = async () => {
    toast.success('Admins have been notified');

    await client.identity.workspace.notifyAdmins(workspace!.id);

    setNotifyAdminButtonDisabled(true);
  };

  const onDowngrade = async () => {
    if (!workspace) return;
    setIsDowngrading(true);

    await downgradeTrial(workspace.id);

    trackEvents.trackTrialExpiredDowngrade();
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
                      onClick={() => paymentModal.openVoid({ isTrialExpired: true })}
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
