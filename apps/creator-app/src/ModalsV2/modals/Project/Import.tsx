import { datadogRum } from '@datadog/browser-rum';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Modal, Select, StatusCode, toast, ToastCallToAction, useAsyncEffect } from '@voiceflow/ui';
import React, { useMemo, useState } from 'react';

import client from '@/client';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as Organization from '@/ducks/organization';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePlanLimitConfig, useSelector } from '@/hooks';
import { useModal } from '@/hooks/modal.hook';
import { useLimitConfig } from '@/hooks/planLimitV3';
import { hasRolePermission } from '@/utils/rolePermission';

import manager from '../../manager';
import Loading from '../Loading';
import Upgrade from '../Upgrade';

const allowedToClone = (workspace: Realtime.Workspace, creatorID: number | null): boolean => {
  if (!creatorID) return false;

  const member = workspace.members.byKey[creatorID];

  if (!member) return false;

  return hasRolePermission(Permission.PROJECTS_MANAGE, member.role);
};

const getCopyProjectTitle = (projectName?: string) =>
  !projectName ? 'Copy Agent' : `Copy Agent: ${projectName}`;

export interface Props {
  projectID?: string;
}

export interface ImportWorkspace {
  id: string;
  name: string;
}

const ImportModal = manager.create<Props>(
  'ProjectImport',
  () =>
    ({ api, type, opened, hidden, animated, projectID }) => {
      const importProject = useDispatch(ProjectV2.importProject);
      const goToWorkspace = useDispatch(Router.goToWorkspace);
      const goToProjectCanvas = useDispatch(Router.goToProjectCanvas);

      const creatorID = useSelector(Account.userIDSelector);
      const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
      const allWorkspaces = useSelector(WorkspaceV2.allWorkspacesSelector);
      const getWorkspaceByID = useSelector(WorkspaceV2.getWorkspaceByIDSelector);

      const workspaces = useMemo(
        () => allWorkspaces.filter((workspace) => allowedToClone(workspace, creatorID)),
        [allWorkspaces, creatorID]
      );

      const workspaceOptions = useMemo(
        () => workspaces.map((workspace) => ({ value: workspace.id, label: workspace.name })),
        [workspaces]
      );
      const workspaceOptionsMap = useMemo(
        () => Utils.array.createMap(workspaceOptions, Utils.object.selectValue),
        [workspaceOptions]
      );

      const [targetWorkspace, setTargetWorkspace] = useState<string | null>(null);

      const loadingModal = useModal(Loading);
      const upgradeModal = useModal(Upgrade);

      const [projectName, setProjectName] = React.useState<string | undefined>();

      const chooseWorkspace = React.useCallback(
        (workspaceID: string) => setTargetWorkspace(workspaceID ?? null),
        [workspaceOptions, setTargetWorkspace]
      );

      const legacyProjectLimitConfig = usePlanLimitConfig(LimitType.PROJECTS, { limit: 2 });
      const newProjectLimitConfig = useLimitConfig(LimitType.EDITOR_SEATS);

      // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
      const projectLimitConfig = subscription ? newProjectLimitConfig : legacyProjectLimitConfig;

      const cloneProject = async (workspaceID?: string) => {
        if (!projectID || !workspaceID) return;

        const workspace = getWorkspaceByID({ id: workspaceID });

        if (!workspace) return;

        api.close();

        try {
          loadingModal.openVoid();

          const importedProject = await importProject(projectID, workspaceID);

          goToWorkspace(workspaceID);

          toast.success(
            <>
              Cloned agent <strong>"{importedProject.name}"</strong> successfully!
              <ToastCallToAction onClick={() => goToProjectCanvas({ versionID: importedProject.versionID })}>
                Open Agent
              </ToastCallToAction>
            </>
          );
        } catch (err) {
          if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === StatusCode.FORBIDDEN) {
            goToWorkspace(workspaceID);

            if (projectLimitConfig) {
              upgradeModal.openVoid(projectLimitConfig.upgradeModal(projectLimitConfig.payload));
            }
            toast.error('unable to access agent');
          } else {
            datadogRum.addError(err);
            toast.error('unable to access agent');
          }
        } finally {
          loadingModal.close();
        }
      };

      useAsyncEffect(async () => {
        if (!projectID) return;

          toast.error('You do not have permission to copy agent to any of your workspaces');
        // If user has 0 workspaces with Editor/Admin/Owner role, show toast
        if (workspaces.length === 0) {
          toast.error('You do not have permission to copy agent to any of your workspaces');

          // setTimeout needed to prevent race condition and creating unclickable overlay
          setTimeout(() => api.close(), 100);
          return;
        }

        setTargetWorkspace(workspaces[0].id);

        // If user has only 1 workspace with Editor/Admin/Owner role, automatically add it
        if (workspaces.length === 1) {
          cloneProject(workspaces[0].id);
        }

        try {
          const importingProject = await client.api.project.get<{ name: string }>(projectID, ['name']);

          toast.error('Not able to retrieve agent information');
          setProjectName(importingProject?.name);
        } catch {
          toast.error('Not able to retrieve agent information');
        }
      }, []);

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
            <Button variant={Button.Variant.TERTIARY} onClick={api.onClose} squareRadius>
              Cancel
            </Button>

            <Button onClick={() => cloneProject(targetWorkspace!)} squareRadius>
              Copy Agent
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default ImportModal;
