import { UserRole } from '@voiceflow/dtos';
import { Box, Button, ButtonVariant, Spinner, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useDispatch, useSelector } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { useTrackingEvents } from '@/hooks/tracking';

import * as S from './styles';

const UPDATE_SUBSCRIPTION_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.BILLING]);

const TrialExpiredPage: React.FC = () => {
  const workspace = useActiveWorkspace();
  const userRole = useSelector(WorkspaceV2.active.members.userRoleSelector);
  const organization = useSelector(Organization.organizationSelector);
  const paymentModal = usePaymentModal();
  const [trackEvents] = useTrackingEvents();

  const [isDowngrading, setIsDowngrading] = React.useState(false);

  const [notifyAdminButtonDisabled, setNotifyAdminButtonDisabled] = React.useState(false);
  const legacyDowngradeTrial = useDispatch(WorkspaceV2.downgradeTrial);
  const newDowngradeTrial = useDispatch(Organization.downgradeTrial);

  /**
   * When trials expires, all users are downgraded to viewers in the permission system.
   * So we need to check their member role to see if they can upgrade the workspace.
   */
  const canUpgradeWorkspace = userRole && UPDATE_SUBSCRIPTION_ROLES.has(userRole);

  const notifyAdmins = async () => {
    toast.success('Admins have been notified');

    await client.identity.workspace.notifyAdmins(workspace!.id);

    setNotifyAdminButtonDisabled(true);
  };

  const onDowngrade = async () => {
    if (!workspace || !organization) return;
    setIsDowngrading(true);

    try {
      if (organization.subscription) {
        await newDowngradeTrial(organization.id, organization.subscription.id);
      } else {
        await legacyDowngradeTrial(workspace.id);
      }

      trackEvents.trackTrialExpiredDowngrade();
      toast.success('Successfully downgraded to Free Plan');
    } catch {
      setIsDowngrading(false);
      toast.error('Failed to downgrade, please try again later');
    }
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
                  <Text color="#132144">
                    Upgrade to Pro, or downgrade to Free to regain full access to your workspace.
                  </Text>
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
                  <Button
                    variant={ButtonVariant.PRIMARY}
                    onClick={notifyAdmins}
                    disabled={notifyAdminButtonDisabled}
                    fullWidth
                  >
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
