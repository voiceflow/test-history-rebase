import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { MenuTypes, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { ConfirmProps } from '@/components/ConfirmModal';
import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import { LimitType } from '@/config/planLimitV2';
import { ALEXA_SUNSET_PROJECT_ID, ExportFormat as CanvasExportFormat, ModalType } from '@/constants';
import * as Export from '@/ducks/export';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useModals } from '@/hooks/modals';
import { usePermission, usePermissions } from '@/hooks/permission';
import * as ModalsV2 from '@/ModalsV2';
import { ShareProjectTab } from '@/pages/Project/components/Header/constants';
import { SharePopperContext } from '@/pages/Project/components/Header/contexts';
import { copy } from '@/utils/clipboard';
import * as Sentry from '@/vendors/sentry';

import { usePlanLimitedAction } from './planLimitV2';
import { useDispatch } from './realtime';
import { useTrackingEvents } from './tracking';
import { useActiveWorkspace } from './workspace';

export const useDeleteProject = ({
  boardID,
  projectID,
  projectName,
}: {
  boardID?: string;
  projectID?: string | null;
  projectName?: string | null;
}): (() => void) => {
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);

  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);

  const onDeleteProject = useDispatch(Project.deleteProject);
  const onGoToDashboard = useDispatch(Router.goToDashboard);
  const onDeleteProjectFromList = useDispatch(ProjectList.deleteProjectFromList);

  const [trackingEvents] = useTrackingEvents();

  const confirmModal = useModals<ConfirmProps>(ModalType.CONFIRM);

  const handleDelete = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      trackingEvents.trackProjectDelete({ versionID: getProjectByID({ id: projectID })?.versionID, projectID });

      if (boardID) {
        await onDeleteProjectFromList(boardID, projectID);
      } else {
        await onDeleteProject(projectID);
        onGoToDashboard();
      }

      toast.success(`Successfully deleted ${projectName}`);
    } catch (e) {
      toast.error(e.message);
    }
  }, [boardID, projectID, projectName, getProjectByID]);

  return React.useCallback(() => {
    if (!canManageProjects) return;

    confirmModal.open({
      body: (
        <>
          This action can not be undone, <b>"{projectName}"</b> and all components can not be recovered.
        </>
      ),
      header: 'Delete Assistant',
      confirmButtonText: 'Delete Forever',
      confirm: handleDelete,
    });
  }, [canManageProjects, projectName, handleDelete]);
};

export const useProjectOptions = ({
  boardID,
  onRename,
  versionID,
  projectID,
  withDelete = true,
  withInvite = false,
  projectName,
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
  projectName?: string | null;
  onDuplicated?: () => void;
  withConvertToDomain?: boolean;
  v2?: boolean;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}): Nullable<MenuTypes.Option>[] => {
  const sharePopper = React.useContext(SharePopperContext);

  const canExportProject = usePermissions([Permission.CANVAS_EXPORT, Permission.MODEL_EXPORT]);
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS);

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

  const onDelete = useDeleteProject({ boardID, projectID, projectName });

  const [trackingEvents] = useTrackingEvents();

  const onDuplicate = usePlanLimitedAction({
    type: LimitType.PROJECTS,
    value: projectsCount,
    limit: workspace?.projects ?? 2,
    onAction: async () => {
      if (!workspace) {
        Sentry.error(Errors.noActiveWorkspaceID());
        toast.genericError();
        return;
      }

      if (!projectID) {
        Sentry.error(Errors.noActiveProjectID());
        toast.genericError();
        return;
      }

      try {
        loadingModal.openVoid();

        trackingEvents.trackProjectDuplicate({ versionID: getProjectByID({ id: projectID })?.versionID, projectID });

        await duplicateProject(projectID, workspace.id, boardID);

        onDuplicated?.();
      } finally {
        loadingModal.close();
      }
    },
    onLimited: (limit) => upgradeModal.openVoid(limit.upgradeModal),
  });

  const onClone = async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
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
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();

      return;
    }

    convertModal.openVoid({ sourceProjectID: projectID });
  };

  const onExport = async () => {
    trackingEvents.trackExportButtonClick({ format: CanvasExportFormat.VF });

    await exportCanvas(CanvasExportFormat.VF, versionID);
  };

  const targetVersionID = versionID || currentVersionID;
  const withInviteOption = withInvite && canAddCollaborators && ((v2 && projectMembersModal) || sharePopper);
  const withDeleteOption = withDelete && canManageProjects;
  const withExportOption = canExportProject && sharePopper;
  const withRenameOption = canManageProjects && onRename;
  const withHistoryOption = canManageProjects && targetVersionID;
  const withSettingsOption = canEditProject && targetVersionID;

  if (v2) {
    return [
      withRenameOption ? { label: 'Rename', onClick: onRename } : null,
      canManageProjects ? { label: 'Duplicate', onClick: onDuplicate } : null,
      canManageProjects ? { label: 'Download', onClick: onExport } : null,
      canManageProjects ? { label: 'Copy clone link', onClick: onClone } : null,
      canManageProjects && withConvertToDomain ? { label: 'Convert to domain', onClick: onCovertToDomain } : null,

      withSettingsOption ? { label: 'divider 1', divider: true } : null,
      withInviteOption ? { label: 'Manage access', onClick: () => projectMembersModal.openVoid() } : null,

      withSettingsOption ? { label: 'Settings', onClick: () => goToSettings(targetVersionID) } : null,

      withDeleteOption ? { label: 'divider-2', divider: true } : null,

      withDeleteOption ? { label: 'Delete', onClick: onDelete } : null,
    ];
  }

  return [
    withHistoryOption ? { label: 'Version history', onClick: () => goToVersions(targetVersionID) } : null,
    withSettingsOption ? { label: 'Project settings', onClick: () => goToSettings(targetVersionID) } : null,
    withInviteOption ? { key: 'invite', label: 'Invite collaborators', onClick: () => sharePopper?.open(ShareProjectTab.INVITE) } : null,
    withExportOption ? { label: 'Export as...', onClick: () => sharePopper.open(ShareProjectTab.EXPORT) } : null,

    withHistoryOption || withSettingsOption || withInviteOption || withExportOption ? { label: 'divider 1', divider: true } : null,

    withRenameOption ? { label: 'Rename project', onClick: onRename } : null,
    canManageProjects ? { label: 'Duplicate project', onClick: onDuplicate } : null,
    canManageProjects ? { label: 'Copy clone link', onClick: onClone } : null,
    canManageProjects && withConvertToDomain ? { label: 'Convert to domain', onClick: onCovertToDomain } : null,

    withDeleteOption ? { label: 'divider-2', divider: true } : null,

    withDeleteOption ? { label: 'Delete project', onClick: onDelete } : null,
  ];
};

export const useAlexaProjectSettings = (): boolean => {
  const project = useSelector(ProjectV2.active.projectSelector);

  if (!project?.id || !project?.platform) return false;

  if (project.platform !== Platform.Constants.PlatformType.ALEXA) return true;

  return project.id < ALEXA_SUNSET_PROJECT_ID;
};
