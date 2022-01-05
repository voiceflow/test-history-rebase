import './ImportModal.css';

import { Button, ButtonVariant, ModalImportSelect, StatusCode, toast } from '@ui';
import * as Realtime from '@voiceflow/realtime-sdk';
import React, { useMemo, useState } from 'react';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { hasRolePermission, Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { extractMemberById } from '@/ducks/workspaceV2/utils';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

const allowedToClone = (workspace: Realtime.Workspace, creatorID: number | null): boolean => {
  if (!creatorID) {
    return false;
  }

  const creatorRole = extractMemberById(workspace.members ?? [], creatorID)?.role;

  return !!creatorRole && hasRolePermission(Permission.MANAGE_PROJECTS, creatorRole);
};

const ImportModal: React.FC = () => {
  const creatorID = useSelector(Account.userIDSelector);
  const workspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);

  const importProject = useDispatch(Workspace.importProject);
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

    const workspace = getWorkspaceByID(workspaceID);

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
    <Modal id={ModalType.IMPORT_PROJECT} title={cloning ? 'Clone Project' : 'Copy Project'}>
      <ModalBody>
        <ModalImportSelect
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
