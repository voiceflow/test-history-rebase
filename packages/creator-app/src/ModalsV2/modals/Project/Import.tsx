import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Modal, Select, StatusCode, toast, ToastCallToAction } from '@voiceflow/ui';
import React, { useMemo, useState } from 'react';

import client from '@/client';
import { ROLE_PERMISSIONS } from '@/config/rolePermission';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { extractMemberById } from '@/ducks/workspaceV2/utils';
import { useAsyncEffect, useDispatch, useFeature, usePlanLimitConfig, useSelector } from '@/hooks';
import { hasRolePermission } from '@/utils/rolePermission';
import * as Sentry from '@/vendors/sentry';

import { useModal } from '../../hooks';
import manager from '../../manager';
import Loading from '../Loading';
import Upgrade from '../Upgrade';

const allowedToClone = (workspace: Realtime.Workspace, creatorID: number | null): boolean => {
  if (!creatorID) {
    return false;
  }

  const creatorRole = extractMemberById(workspace.members ?? [], creatorID)?.role;

  return !!creatorRole && hasRolePermission(Permission.MANAGE_PROJECTS, creatorRole);
};

const getCopyProjectTitle = (projectName?: string) => (!projectName ? 'Copy Project' : `Copy Project: ${projectName}`);

export interface Props {
  projectID?: string;
}

export interface ImportWorkspace {
  id: string;
  name: string;
}

const ImportModal = manager.create<Props>('ProjectImport', () => ({ api, type, opened, hidden, animated, projectID }) => {
  const creatorID = useSelector(Account.userIDSelector);
  const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);

  const goToDomain = useDispatch(Router.goToDomain);
  const importProject = useDispatch(Workspace.importProject);
  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const reduxWorkspaces = useSelector(WorkspaceV2.allWorkspacesSelector);

  const identityWorkspaceMember = useFeature(Realtime.FeatureFlag.IDENTITY_WORKSPACE_MEMBER);

  const [workspaces, setWorkspaces] = useState<ImportWorkspace[]>([]);

  const workspaceOptions = useMemo(() => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })), [workspaces]);
  const workspaceOptionsMap = useMemo(() => Utils.array.createMap(workspaceOptions, Utils.object.selectValue), [workspaceOptions]);

  const [targetWorkspace, setTargetWorkspace] = useState<string | null>(null);

  const loadingModal = useModal(Loading);
  const upgradeModal = useModal(Upgrade);

  const [projectName, setProjectName] = React.useState<string | undefined>();

  const chooseWorkspace = React.useCallback((workspaceID: string) => setTargetWorkspace(workspaceID ?? null), [workspaceOptions, setTargetWorkspace]);

  const projectLimitConfig = usePlanLimitConfig(LimitType.PROJECTS, { limit: 2 });

  const cloneProject = async (workspaceID?: string) => {
    if (!projectID || !workspaceID) return;

    const workspace = getWorkspaceByID({ id: workspaceID });

    if (!workspace) return;

    api.close();

    const projectCountPerWorkspace = workspace.boards.reduce((acc, board) => acc + (board.projects.length || 0), 0);

    if (projectLimitConfig && projectCountPerWorkspace >= workspace.projects) {
      goToWorkspace(workspaceID);

      upgradeModal.openVoid(projectLimitConfig.upgradeModal(projectLimitConfig.payload));
      return;
    }

    try {
      loadingModal.openVoid();

      const importedProject = await importProject(projectID, workspaceID);

      goToWorkspace(workspaceID);

      toast.success(
        <>
          Cloned project <strong>"{importedProject.name}"</strong> successfully!
          <ToastCallToAction onClick={() => goToDomain({ versionID: importedProject.versionID })}>Open Project</ToastCallToAction>
        </>
      );
    } catch (err) {
      if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === StatusCode.FORBIDDEN) {
        goToWorkspace(workspaceID);

        if (projectLimitConfig) {
          upgradeModal.openVoid(projectLimitConfig.upgradeModal(projectLimitConfig.payload));
        }
      } else {
        Sentry.error(err);
        toast.error('unable to access project');
      }
    } finally {
      loadingModal.close();
    }
  };

  useAsyncEffect(async () => {
    let authorizedWorkspaces: ImportWorkspace[] = [];
    // get a list of workspaces with editor/owner/admin role
    if (identityWorkspaceMember.isEnabled) {
      authorizedWorkspaces = await client.identity.workspace.list(ROLE_PERMISSIONS[Permission.MANAGE_PROJECTS].roles);
    } else {
      authorizedWorkspaces = reduxWorkspaces.filter((workspace) =>
        workspace.members.some((member) => member.creator_id === creatorID && allowedToClone(workspace, creatorID))
      );
    }
    setWorkspaces(authorizedWorkspaces);

    if (!projectID) return;

    // If user has 0 workspaces with Editor/Admin/Owner role, show toast
    if (authorizedWorkspaces.length === 0) {
      toast.error('You do not have permission to copy project to any of your workspaces');

      // setTimeout needed to prevent race condition and creating unclickable overlay
      setTimeout(() => api.close(), 100);
      return;
    }

    // If user has only 1 workspace with Editor/Admin/Owner role, automatically add it
    if (authorizedWorkspaces.length === 1) {
      cloneProject(authorizedWorkspaces[0].id);
    }

    setTargetWorkspace(authorizedWorkspaces[0]?.id);

    try {
      const importingProject = await client.api.project.get<{ name: string }>(projectID, ['name']);

      setProjectName(importingProject?.name);
    } catch {
      toast.error('Not able to retrieve project information');
    }
  });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={392}>
      <Modal.Header>{getCopyProjectTitle(projectName)}</Modal.Header>

      <Modal.Body>
        <Select
          value={targetWorkspace}
          prefix="COPY TO"
          options={workspaceOptions}
          onSelect={(value) => chooseWorkspace(value)}
          disabled={workspaceOptions.length === 1}
          getOptionKey={(option) => option.value}
          getOptionValue={(option) => option?.value}
          getOptionLabel={(value) => value && workspaceOptionsMap[value]?.label}
          renderOptionLabel={(option) => option.label}
        />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={api.close} squareRadius>
          Cancel
        </Button>

        <Button onClick={() => cloneProject(targetWorkspace!)} squareRadius>
          Copy Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ImportModal;
