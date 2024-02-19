import { Button, ButtonVariant, FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { bannerBg } from '@/assets';
import * as Workspace from '@/components/Workspace';
import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import List from './List.component';
import * as S from './styles';

const DashboardV2MembersAndBillingMembers: React.FC = () => {
  const membersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const isOnPaidPlanSelector = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isOnProTrial = useSelector(WorkspaceV2.active.isOnProTrialSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector)!;

  const [canAddSeats] = usePermission(Permission.BILLING_SEATS_ADD);
  const [canInviteMembers] = usePermission(Permission.INVITE);

  const inviteModal = ModalsV2.useModal(ModalsV2.Workspace.Invite);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);
  const addSeatsModal = ModalsV2.useModal(ModalsV2.Billing.AddSeats);

  return (
    <S.Container>
      {(!isOnPaidPlanSelector || isOnProTrial) && canAddSeats && (
        <S.StyledBanner
          mb={32}
          title="Unlock your teams potential"
          onClick={() => paymentModal.open({})}
          subtitle="Upgrade to unlock unlimited assistant and so much more."
          buttonText="Upgrade Now"
          backgroundImage={bannerBg}
        />
      )}

      <S.Header>
        <div>
          <S.Title>{membersCount} Workspace Members</S.Title>

          <Workspace.TakenSeatsMessage label="Editor seats taken." />
        </div>

        <FlexCenter gap={10}>
          {subscription && canAddSeats && (
            <Button variant={ButtonVariant.SECONDARY} nowrap onClick={() => addSeatsModal.openVoid()}>
              Add Seats
            </Button>
          )}
          {canInviteMembers && (
            <Button variant={ButtonVariant.PRIMARY} onClick={() => inviteModal.openVoid()}>
              Invite Members
            </Button>
          )}
        </FlexCenter>
      </S.Header>

      <List />
    </S.Container>
  );
};

export default DashboardV2MembersAndBillingMembers;
