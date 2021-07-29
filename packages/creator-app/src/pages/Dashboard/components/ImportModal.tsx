import './ImportModal.css';

import { Button, ButtonVariant, StatusCode, toast } from '@voiceflow/ui';
import React, { useMemo, useState } from 'react';

import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { FeatureFlag } from '@/config/features';
import { hasRolePermission, Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import { extractMemberById } from '@/ducks/realtimeV2/workspace/utils';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useFeature, useModals, useRealtimeSelector, useSelector, useTrackingEvents } from '@/hooks';
import { Workspace as WorkspaceModel } from '@/models';
import * as Sentry from '@/vendors/sentry';

import { ImportSelect } from './ModalComponents';

const allowedToClone = (workspace: WorkspaceModel, creatorID: number | null): boolean => {
  if (!creatorID) {
    return false;
  }

  const creatorRole = extractMemberById(workspace.members ?? [], creatorID)?.role;

  return !!creatorRole && hasRolePermission(Permission.MANAGE_PROJECTS, creatorRole);
};

const ImportModal: React.FC = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const creatorID = useSelector(Account.userIDSelector);
  const workspacesV1 = useSelector(Workspace.allWorkspacesSelector);
  const workspacesRealtime = useRealtimeSelector(RealtimeWorkspace.allWorkspacesSelector);
  const workspaceByIDSelectorV1 = useSelector(Workspace.workspaceByIDSelector);
  const workspaceByIDSelectorRealtime = useRealtimeSelector(
    (state) => (workspaceID: string) => RealtimeWorkspace.workspaceByIDSelector(state, { id: workspaceID })
  );

  const workspaces = atomicActions.isEnabled ? workspacesRealtime : workspacesV1;
  const workspaceByIDSelector = atomicActions.isEnabled ? workspaceByIDSelectorRealtime : workspaceByIDSelectorV1;

  const importProject = useDispatch(Workspace.importProjectToActiveWorkspace);
  const goToWorkspace = useDispatch(Router.goToWorkspace);

  const [trackEvents] = useTrackingEvents();
  const workspaceOptions = useMemo(() => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })), [workspaces]);
  const [targetWorkspace, setTargetWorkspace] = useState<typeof workspaceOptions[number] | null>(workspaceOptions[0]);
  const { close, toggle, data, isOpened } = useModals<{ projectID?: string; cloning?: boolean }>(ModalType.IMPORT_PROJECT);
  const { open: openLoadingModal, close: closeLoadingModal } = useModals(ModalType.LOADING);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const [multipleWorkspaces, setMultipleWorkspaces] = React.useState(false);

  const { projectID, cloning = false } = data;

  const renderModal = isOpened && multipleWorkspaces;

  React.useEffect(() => {
    if (!projectID) return;

    // get a list of workspaces with editor/owner/admin role
    const authorizedWorkspaces = workspaces.filter((workspace) =>
      workspace.members.some((member) => member.creator_id === creatorID && allowedToClone(workspace, creatorID))
    );

    // If user has 0 workspaces with Editor/Admin/Owner role, show toast
    if (authorizedWorkspaces.length === 0) {
      setMultipleWorkspaces(false);
      toast.error('You do not have permission to copy project to any of your workspaces');

      // setTimeout needed to prevent race condition and creating unclickable overlay
      setTimeout(() => {
        close();
      }, 100);
    }
    // If user has only 1 workspace with Editor/Admin/Owner role, automatically add it
    else if (authorizedWorkspaces.length === 1) {
      setMultipleWorkspaces(false);
      cloneProject(authorizedWorkspaces[0].id);
    } else {
      setMultipleWorkspaces(true);
    }
  }, [targetWorkspace, projectID]);

  React.useEffect(() => {
    setTargetWorkspace(workspaceOptions[0]);
  }, [workspaceOptions]);

  const chooseWorkspace = React.useCallback(
    (workspaceID: string) => setTargetWorkspace(workspaceOptions.find(({ value }) => value === workspaceID) ?? null),
    [workspaceOptions, setTargetWorkspace]
  );

  const cloneProject = async (workspaceID?: string) => {
    if (!projectID || !workspaceID) return;

    const workspace = workspaceByIDSelector(workspaceID);

    if (!workspace) return;

    const projectCountPerWorkspace = workspace.boards.reduce((acc, board) => acc + (board.projects.length || 0), 0);

    if (projectCountPerWorkspace >= workspace.projects) {
      close();
      goToWorkspace(workspaceID);
      openProjectLimitModal({ message: 'Project limitations is reached' });
      return;
    }

    if (allowedToClone(workspace, creatorID)) {
      try {
        close();
        openLoadingModal();

        const importedProject = await importProject(projectID, workspaceID);

        if (cloning) {
          trackEvents.trackProjectClone({
            templateID: importedProject.id,
            templateName: importedProject.name,
            workspaceID,
          });
        }
      } catch (e) {
        closeLoadingModal();

        if (e.statusCode === StatusCode.FORBIDDEN) {
          goToWorkspace(workspaceID);
          openProjectLimitModal({ message: 'Project limitations is reached' });
        } else {
          Sentry.error(e);
          toast.error('unable to access project');
        }

        return;
      }
      goToWorkspace(workspaceID);

      toast.success('Cloned project successfully!');

      closeLoadingModal();
    } else {
      toast.error(
        `You are a viewer on the workspace ${workspace.name}, and therefore don’t have the permissions to clone projects to this workspace`
      );
    }
  };

  return renderModal ? (
    <Modal isOpen={isOpened} toggle={toggle} className="import-modal">
      <ModalHeader toggle={toggle} header={cloning ? 'Clone Project' : 'Copy Project'}></ModalHeader>

      <ModalBody>
        <ImportSelect
          prefix={cloning ? 'CLONE TO' : 'COPY TO'}
          value={targetWorkspace?.label}
          onSelect={(value: any) => chooseWorkspace(value)}
          disabled={workspaceOptions.length === 1}
          options={workspaceOptions}
          getOptionValue={(option: any) => option.value}
          renderOptionLabel={(option: any) => option.label}
        />
      </ModalBody>

      <ModalFooter>
        {!cloning && (
          <Button variant={ButtonVariant.TERTIARY} onClick={() => toggle()}>
            Cancel
          </Button>
        )}

        <Button onClick={() => cloneProject(targetWorkspace?.value)}>{cloning ? 'Clone' : 'Copy Project'}</Button>
      </ModalFooter>
    </Modal>
  ) : null;
};

export default ImportModal;
