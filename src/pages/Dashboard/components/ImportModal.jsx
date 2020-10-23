import './ImportModal.css';

import React, { useMemo, useState } from 'react';

import { StatusCode } from '@/client/fetch';
import Button from '@/components/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { toast } from '@/components/Toast';
import { Permission, hasPermission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { userIDSelector } from '@/ducks/account';
import { goToWorkspace } from '@/ducks/router';
import { allWorkspacesSelector, workspaceByIDSelector } from '@/ducks/workspace';
import { extractMemberById } from '@/ducks/workspace/utils';
import { connect } from '@/hocs';
import { useModals, useTrackingEvents } from '@/hooks';
import { importProject } from '@/store/sideEffects';
import { importProject as importProjectV2 } from '@/store/sideEffectsV2';

import { ImportSelect } from './ModalComponents';

const allowedToClone = (workspace, creatorId) => {
  const creatorRole = extractMemberById(creatorId, workspace.members)?.role;
  return hasPermission(Permission.MANAGE_PROJECTS, creatorRole, null);
};

function ImportModal({ importProject, importProjectV2, workspaces, workspaceByIDSelector, goToWorkspace, creatorId }) {
  const [trackEvents] = useTrackingEvents();
  const workspaceOptions = useMemo(() => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })), [workspaces]);
  const [targetWorkspace, setTargetWorkspace] = useState(workspaceOptions[0]);
  const { close, toggle, data, isOpened } = useModals(ModalType.IMPORT_PROJECT);
  const { open: openLoadingModal, close: closeLoadingModal } = useModals(ModalType.LOADING);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { importToken, cloning = false } = data;
  const [multipleWorkspaces, setMultipleWorkspaces] = React.useState(null);

  const renderModal = isOpened && multipleWorkspaces;

  React.useEffect(() => {
    if (!importToken) return;
    // get a list of workspaces with editor/owner/admin role
    const authorizedWorkspaces = workspaces.filter((workspace) => {
      return workspace.members.some((member) => member.creator_id === creatorId && allowedToClone(workspace, creatorId));
    });
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
  }, [targetWorkspace, importToken]);

  React.useEffect(() => {
    setTargetWorkspace(workspaceOptions[0]);
  }, [workspaceOptions]);

  const chooseWorkspace = React.useCallback((workspaceID) => setTargetWorkspace(workspaceOptions.find(({ value }) => value === workspaceID)), [
    workspaceOptions,
    setTargetWorkspace,
  ]);

  const cloneProject = async (workspaceId) => {
    const workspace = workspaceByIDSelector(workspaceId);
    if (allowedToClone(workspace, creatorId)) {
      try {
        close();
        openLoadingModal();
        const importedProject = await (importToken.length === 24
          ? importProjectV2(importToken, workspaceId)
          : importProject(workspaceId, importToken, true));

        if (cloning) {
          trackEvents.trackProjectClone({
            template_id: importedProject.id,
            template_name: importedProject.name,
            workspace_id: workspaceId,
          });
        }
      } catch (e) {
        closeLoadingModal();
        if (e.statusCode === StatusCode.FORBIDDEN) {
          goToWorkspace(workspaceId);
          openProjectLimitModal({ message: 'Project limitations is reached' });
        } else {
          console.error(e);
          toast.error('unable to access project');
        }

        return;
      }
      goToWorkspace(workspaceId);
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
  workspaces: allWorkspacesSelector,
  workspaceByIDSelector,
  creatorId: userIDSelector,
};

const mapDispatchToProps = {
  importProject,
  importProjectV2,
  goToWorkspace,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportModal);
