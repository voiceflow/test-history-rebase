import { datadogRum } from '@datadog/browser-rum';
import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuTypes, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { ALEXA_SUNSET_PROJECT_ID, ExportFormat as CanvasExportFormat, PageProgressBar } from '@/constants';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Export from '@/ducks/export';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useFeature } from '@/hooks';
import { useHasPermissions, usePermission } from '@/hooks/permission';
import * as ModalsV2 from '@/ModalsV2';
import { ShareProjectTab } from '@/pages/Project/components/Header/constants';
import { SharePopperContext } from '@/pages/Project/components/Header/contexts';
import { copy } from '@/utils/clipboard';

import { usePlanLimitedAction } from './planLimitV2';
import { useDispatch } from './realtime';
import { useTrackingEvents } from './tracking';
import { useActiveWorkspace } from './workspace';

export const useDeleteProject = ({ boardID, projectID }: { boardID?: string; projectID?: string | null }): (() => void) => {
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);

  const deleteModal = ModalsV2.useModal(ModalsV2.Project.Delete);

  return React.useCallback(() => {
    if (!canManageProjects || !projectID) return;

    deleteModal.open({ projectID, boardID });
  }, [canManageProjects]);
};

export const useProjectOptions = ({
  boardID,
  onRename,
  versionID,
  projectID,
  withDelete = true,
  withInvite = false,
  onDuplicated,
  withConvertToDomain = false,
  v2 = false,
}: {
  boardID?: string;
  onRename?: () => void;
  versionID?: string;
  projectID?: string | null;
  withDelete?: boolean;
  withInvite?: boolean;
  onDuplicated?: () => void;
  withConvertToDomain?: boolean;
  v2?: boolean;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}): Nullable<MenuTypes.Option>[] => {
  const sharePopper = React.useContext(SharePopperContext);
  const dashboardV2 = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  const canExportProject = useHasPermissions([Permission.CANVAS_EXPORT, Permission.MODEL_EXPORT]);
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canAddCollaboratorsV2] = usePermission(Permission.ADD_COLLABORATORS_V2, { workspaceLevelOnly: true });
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS, { workspaceLevelOnly: true });
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS, { workspaceLevelOnly: true });

  const workspace = useActiveWorkspace();
  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);
  const currentVersionID = useSelector(Session.activeVersionIDSelector);

  const goToVersions = useDispatch(Router.goToVersions);
  const goToSettings = useDispatch(Router.goToSettings);
  const duplicateProject = useDispatch(Workspace.duplicateProject);
  const updateProjectPrivacy = useDispatch(Project.updateProjectPrivacy);
  const exportCanvas = useDispatch(Export.exportCanvas);

  const convertModal = ModalsV2.useModal(ModalsV2.Domain.Convert);
  const loadingModal = ModalsV2.useModal(ModalsV2.Loading);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectMembersModal = ModalsV2.useModal(ModalsV2.Project.Members);
  const projectDownloadModal = ModalsV2.useModal(ModalsV2.Project.Download);

  const onDelete = useDeleteProject({ boardID, projectID });

  const [trackingEvents] = useTrackingEvents();

  const onDuplicate = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projectsCount,
    limit: workspace?.projects ?? 2,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),

    onAction: async () => {
      if (!workspace) {
        datadogRum.addError(Errors.noActiveWorkspaceID());
        toast.genericError();
        return;
      }

      if (!projectID) {
        datadogRum.addError(Errors.noActiveProjectID());
        toast.genericError();
        return;
      }

      try {
        if (dashboardV2.isEnabled) {
          PageProgress.start(PageProgressBar.ASSISTANT_DUPLICATING);
        } else {
          loadingModal.openVoid();
        }

        trackingEvents.trackProjectDuplicate({ versionID: getProjectByID({ id: projectID })?.versionID, projectID });

        await duplicateProject(projectID, workspace.id, boardID);

        onDuplicated?.();
      } catch {
        toast.genericError();
      } finally {
        if (dashboardV2.isEnabled) {
          PageProgress.stop(PageProgressBar.ASSISTANT_DUPLICATING);
        } else {
          loadingModal.close();
        }
      }
    },
  });

  const onClone = async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    if (canShareProject) {
      try {
        copy(`${window.location.origin}/dashboard?import=${projectID}`);

        toast.success('Copied to clipboard');

        trackingEvents.trackActiveProjectDownloadLinkShare();

        updateProjectPrivacy(projectID, BaseModels.Project.Privacy.PUBLIC);
      } catch {
        toast.error('Error getting import link');
      }
    } else {
      projectDownloadModal.openVoid();
    }
  };

  const onCovertToDomain = async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();

      return;
    }

    convertModal.openVoid({ sourceProjectID: projectID });
  };

  const onExport = async () => {
    trackingEvents.trackExportButtonClick({ format: CanvasExportFormat.VF });

    await exportCanvas(CanvasExportFormat.VF, versionID, projectID);
  };

  const targetVersionID = versionID || currentVersionID;
  const withInviteOption = withInvite && canAddCollaborators && ((v2 && projectMembersModal) || sharePopper);
  const withDeleteOption = withDelete && canManageProjects;
  const withExportOption = canExportProject && sharePopper;
  const withRenameOption = canEditProject && onRename;
  const withHistoryOption = canManageProjects && targetVersionID;
  const withSettingsOption = canEditProject && targetVersionID;

  if (v2) {
    return [
      withRenameOption ? { label: 'Rename', onClick: onRename } : null,
      canManageProjects ? { label: 'Duplicate', onClick: onDuplicate } : null,
      canExportProject ? { label: 'Download (.vf)', onClick: onExport } : null,
      canManageProjects ? { label: 'Copy clone link', onClick: onClone } : null,
      canManageProjects && withConvertToDomain ? { label: 'Convert to domain', onClick: onCovertToDomain } : null,

      canExportProject || canManageProjects || withRenameOption ? { label: 'divider-1', divider: true } : null,
      withInviteOption && canAddCollaboratorsV2
        ? { label: 'Manage access', onClick: () => projectID && projectMembersModal.openVoid({ projectID }) }
        : null,

      withSettingsOption ? { label: 'Settings', onClick: () => goToSettings(targetVersionID) } : null,

      withDeleteOption ? { label: 'divider-2', divider: true } : null,

      withDeleteOption ? { label: 'Delete', onClick: onDelete } : null,
    ];
  }

  return [
    withHistoryOption ? { label: 'Version history', onClick: () => goToVersions(targetVersionID) } : null,
    withSettingsOption ? { label: 'Assistant settings', onClick: () => goToSettings(targetVersionID) } : null,
    withInviteOption ? { key: 'invite', label: 'Invite collaborators', onClick: () => sharePopper?.open(ShareProjectTab.INVITE) } : null,
    withExportOption ? { label: 'Export as...', onClick: () => sharePopper.open(ShareProjectTab.EXPORT) } : null,

    withHistoryOption || withSettingsOption || withInviteOption || (withExportOption && canManageProjects)
      ? { label: 'divider-1', divider: true }
      : null,

    withRenameOption ? { label: 'Rename assistant', onClick: onRename } : null,
    canManageProjects ? { label: 'Duplicate assistant', onClick: onDuplicate } : null,
    canManageProjects ? { label: 'Copy clone link', onClick: onClone } : null,
    canManageProjects && withConvertToDomain ? { label: 'Convert to domain', onClick: onCovertToDomain } : null,

    withDeleteOption ? { label: 'divider-2', divider: true } : null,

    withDeleteOption ? { label: 'Delete assistant', onClick: onDelete } : null,
  ];
};

export const useAlexaProjectSettings = (): boolean => {
  const project = useSelector(ProjectV2.active.projectSelector);

  if (!project?.id || !project?.platform) return false;

  if (project.platform !== Platform.Constants.PlatformType.ALEXA) return true;

  return project.id < ALEXA_SUNSET_PROJECT_ID;
};

export const useSyncProjectLiveVersion = () => {
  const activeProjectID = useSelector(ProjectV2.active.idSelector);

  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  React.useEffect(() => {
    if (!activeProjectID) return;

    (async () => {
      const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
      updateProjectLiveVersion(activeProjectID, liveVersion!);
    })();
  }, []);
};
