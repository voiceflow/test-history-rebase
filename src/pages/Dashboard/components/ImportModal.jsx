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
  return (
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
  );
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
