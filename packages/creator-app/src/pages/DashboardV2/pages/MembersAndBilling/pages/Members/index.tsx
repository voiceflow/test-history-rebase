import { Banner, Button, ButtonVariant, FlexCenter, Text } from '@voiceflow/ui';
import React from 'react';

import Workspace from '@/components/Workspace';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useOnAddSeats, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import MemberList from './List';
import * as S from './styles';

const DashboardV2TeamAndBillingMembers: React.FC = () => {
  const membersCount = useSelector(WorkspaceV2.active.allNormalizedMembersCountSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const isOnPaidPlanSelector = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const canAddCollaborators = usePermission(Permission.ADD_COLLABORATORS_V2);

  const inviteModal = ModalsV2.useModal(ModalsV2.Workspace.Invite);
  const paymentModal = ModalsV2.useModal(ModalsV2.Payment);

  const onAddSeats = useOnAddSeats();

  return (
    <S.Container>
      {!isOnPaidPlanSelector && (
        <Banner
          mb={32}
          title="Unlock your teams potential"
          onClick={() => paymentModal.open({})}
          subtitle="Upgrade to unlock unlimited assistant and so much more."
          buttonText="Upgrade Now"
        />
      )}

      <S.Header>
        <div>
          <S.Title>{membersCount} Workspace Members</S.Title>

          {canAddCollaborators ? (
            <Workspace.TakenSeatsMessage />
          ) : (
            <Text color="#62778c">
              <Text color="#132144">{usedEditorSeats} Editor seats</Text> Being used in this workspace.
            </Text>
          )}
        </div>

        <FlexCenter gap={10}>
          {canAddCollaborators && (
            <Button variant={ButtonVariant.SECONDARY} nowrap onClick={() => onAddSeats()}>
              Add Seats
            </Button>
          )}

          <Button variant={ButtonVariant.PRIMARY} onClick={() => inviteModal.openVoid()}>
            Invite Members
          </Button>
        </FlexCenter>
      </S.Header>
      <MemberList />
    </S.Container>
  );
};

export default DashboardV2TeamAndBillingMembers;
