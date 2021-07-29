import './ImportModal.css';

import { Button, StatusCode, toast } from '@voiceflow/ui';
import React, { useMemo, useState } from 'react';

import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { hasPermission, Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { extractMemberById } from '@/ducks/workspace/utils';
import { connect } from '@/hocs';
import { useModals, useTrackingEvents } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

import { ImportSelect } from './ModalComponents';

const allowedToClone = (workspace, creatorID) => {
  const creatorRole = extractMemberById(creatorID, workspace.members)?.role;
  return hasPermission(Permission.MANAGE_PROJECTS, creatorRole, null);
};

function ImportModal({ importProject, workspaces, workspaceByIDSelector, goToWorkspace, creatorID }) {
  const [trackEvents] = useTrackingEvents();
  const workspaceOptions = useMemo(() => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })), [workspaces]);
  const [targetWorkspace, setTargetWorkspace] = useState(workspaceOptions[0]);
  const { close, toggle, data, isOpened } = useModals(ModalType.IMPORT_PROJECT);
  const { open: openLoadingModal, close: closeLoadingModal } = useModals(ModalType.LOADING);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { projectID, cloning = false } = data;
  const [multipleWorkspaces, setMultipleWorkspaces] = React.useState(null);

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
    (workspaceID) => setTargetWorkspace(workspaceOptions.find(({ value }) => value === workspaceID)),
    [workspaceOptions, setTargetWorkspace]
  );

  const cloneProject = async (workspaceID) => {
    const workspace = workspaceByIDSelector(workspaceID);

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
      <ModalBody padding="0 32px 32px 32px">
        <ImportSelect
          prefix={cloning ? 'CLONE TO' : 'COPY TO'}
          value={targetWorkspace?.label}
          onSelect={chooseWorkspace}
          disabled={workspaceOptions.length === 1}
          options={workspaceOptions}
          getOptionValue={(option) => option.value}
          renderOptionLabel={(option) => option.label}
        />
      </ModalBody>
      <ModalFooter>
        {!cloning && (
          <Button variant="tertiary" onClick={toggle}>
            Cancel
          </Button>
        )}
        <Button onClick={() => cloneProject(targetWorkspace.value)}>{cloning ? 'Clone' : 'Copy Project'}</Button>
      </ModalFooter>
    </Modal>
  ) : null;
}

const mapStateToProps = {
  workspaces: Workspace.allWorkspacesSelector,
  workspaceByIDSelector: Workspace.workspaceByIDSelector,
  creatorID: Account.userIDSelector,
};

const mapDispatchToProps = {
  importProject: Workspace.importProjectToActiveWorkspace,
  goToWorkspace: Router.goToWorkspace,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportModal);
