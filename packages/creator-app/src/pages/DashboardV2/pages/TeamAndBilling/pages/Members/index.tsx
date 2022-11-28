import { PlanType } from '@voiceflow/internal';
import { Banner, Button, ButtonVariant, FlexCenter, TextButton } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { EditorLimitDetailsDashboardV2, STARTER_PRO_EDITOR_LIMIT } from '@/config/planLimits/numEditors';
import { ModalType } from '@/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveWorkspace, useModals, usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import MemberList from './List';
import * as S from './styles';

const DashboardV2TeamAndBillingMembers: React.FC = () => {
  const plan = useSelector(WorkspaceV2.active.planSelector);
  const activeWorkspace = useActiveWorkspace();
  const canEditOrganization = usePermission(Permission.EDIT_ORGANIZATION);
  const canConfigureWorkspace = usePermission(Permission.CONFIGURE_WORKSPACE);
  const collaboratorsModal = ModalsV2.useModal(ModalsV2.Collaborators);
  const updgradeModal = useModals(ModalType.UPGRADE_MODAL);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const isOnPaidPlanSelector = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const handleAddSeats = () => updgradeModal.open({ planLimitDetails: EditorLimitDetailsDashboardV2 });
  const handleUpgradeNow = () => null;
  const canAddSeats = (canEditOrganization || canConfigureWorkspace) && plan !== PlanType.ENTERPRISE;

  return (
    <S.Container>
      {!isOnPaidPlanSelector && (
        <Banner
          title="Unlock your teams potential"
          subtitle="Upgrade to unlock unlimited assistant and so much more."
          isCloseable={false}
          buttonText="Upgrade Now"
          onClick={handleUpgradeNow}
          mb={32}
        />
      )}
      <S.Header>
        <div>
          <S.Title>{activeWorkspace?.members?.length} Workspace Members</S.Title>
          <S.EditorSeatsDescription>
            {canAddSeats ? (
              <>
                <strong>{usedEditorSeats}</strong> of {STARTER_PRO_EDITOR_LIMIT} seats taken.{' '}
                <TextButton onClick={handleAddSeats}>Need more?</TextButton>
              </>
            ) : (
              <>
                <strong>{usedEditorSeats} Editor seats</strong> Being used in this workspace.
              </>
            )}
          </S.EditorSeatsDescription>
        </div>
        <FlexCenter gap={10}>
          {canAddSeats && (
            <Button variant={ButtonVariant.SECONDARY} nowrap onClick={handleAddSeats}>
              Add Seats
            </Button>
          )}
          <Button variant={ButtonVariant.PRIMARY} onClick={() => collaboratorsModal.openVoid()}>
            Invite Members
          </Button>
        </FlexCenter>
      </S.Header>
      <MemberList />
    </S.Container>
  );
};

export default DashboardV2TeamAndBillingMembers;
