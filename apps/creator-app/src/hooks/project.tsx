import { datadogRum } from '@datadog/browser-rum';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { MenuTypes, toast, Utils } from '@voiceflow/ui';
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
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useHasPermissions, useIsLockedProjectViewer, useIsPreviewer, usePermission } from '@/hooks/permission';
import * as ModalsV2 from '@/ModalsV2';
import { ShareProjectTab } from '@/pages/Project/components/Header/constants';
import { SharePopperContext } from '@/pages/Project/components/Header/contexts';
import { copy } from '@/utils/clipboard';

import { usePlanLimitedAction } from './planLimitV2';
import { useDispatch } from './realtime';
import { useTrackingEvents } from './tracking';

export const useDeleteProject = ({ boardID, projectID }: { boardID?: string; projectID?: string | null }): (() => void) => {
  const [canManageProjects] = usePermission(Permission.PROJECTS_MANAGE, { workspaceOnly: true });

  const deleteModal = ModalsV2.useModal(ModalsV2.Project.Delete);

  return React.useCallback(() => {
    if (!canManageProjects || !projectID) return;

    deleteModal.open({ projectID, boardID });
  }, [canManageProjects]);
};

export const useProjectOptions = ({
  canvas,
  boardID,
  onRename,
  versionID,
  projectID,
  withDelete = true,
  withInvite = false,
  onDuplicated,
  withConvertToDomain = false,
}: {
  canvas?: boolean;
  boardID?: string;
  onRename?: () => void;
  versionID?: string;
  projectID?: string | null;
  withDelete?: boolean;
  withInvite?: boolean;
  onDuplicated?: () => void;
  withConvertToDomain?: boolean;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}): MenuTypes.Option[] => {
  const sharePopper = React.useContext(SharePopperContext);

  const isPreviewer = useIsPreviewer();
  const canExportProject = useHasPermissions([Permission.CANVAS_EXPORT, Permission.MODEL_EXPORT]);
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canShareProject] = usePermission(Permission.PROJECT_SHARE);
  const [canViewVersions] = usePermission(Permission.PROJECT_VERSIONS);
  const [canManageProjects] = usePermission(Permission.PROJECTS_MANAGE, { workspaceOnly: true });
  const [canAddCollaborators] = usePermission(Permission.ADD_COLLABORATORS, { workspaceOnly: true });
  const isLockedProjectViewer = useIsLockedProjectViewer();
  const [canAddCollaboratorsV2] = usePermission(Permission.ADD_COLLABORATORS_V2, { workspaceOnly: true });
  const [canConvertProjectToDomain] = usePermission(Permission.PROJECT_CONVERT_TO_DOMAIN);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);
  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const currentVersionID = useSelector(Session.activeVersionIDSelector);

  const goToVersions = useDispatch(Router.goToVersions);
  const goToSettings = useDispatch(Router.goToSettings);
  const duplicateProject = useDispatch(Workspace.duplicateProject);
  const updateProjectPrivacy = useDispatch(Project.updateProjectPrivacy);
  const exportCanvas = useDispatch(Export.exportCanvas);

  const convertModal = ModalsV2.useModal(ModalsV2.Domain.Convert);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);
  const projectMembersModal = ModalsV2.useModal(ModalsV2.Project.Members);
  const projectDownloadModal = ModalsV2.useModal(ModalsV2.Project.Download);

  const onDelete = useDeleteProject({ boardID, projectID });

  const [trackingEvents] = useTrackingEvents();

  const onDuplicate = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projectsCount,
    limit: projectsLimit,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),

    onAction: async () => {
      if (!workspaceID) {
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
        PageProgress.start(PageProgressBar.ASSISTANT_DUPLICATING);

        await duplicateProject(projectID, workspaceID, boardID);

        onDuplicated?.();
      } catch {
        toast.genericError();
      } finally {
        PageProgress.stop(PageProgressBar.ASSISTANT_DUPLICATING);
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

  const isPreviewerOrLockedViewer = isPreviewer || isLockedProjectViewer;
  const withInviteOption = !isPreviewerOrLockedViewer && withInvite && canAddCollaborators && (!canvas || !!sharePopper);
  const withDeleteOption = !isPreviewer && withDelete && canManageProjects;
  const withExportOption = !isPreviewerOrLockedViewer && canExportProject && !!sharePopper;
  const withRenameOption = !isPreviewerOrLockedViewer && canEditProject && !!onRename;
  const withHistoryOption = !isPreviewerOrLockedViewer && canViewVersions && !!targetVersionID;
  const withSettingsOption = !isPreviewerOrLockedViewer && canEditProject && !!targetVersionID;
  const withDownloadOption = !isPreviewer;
  const withDuplicateOption = !isPreviewerOrLockedViewer && canManageProjects;
  const withCopyCloneLinkOption = !isPreviewer && canManageProjects;
  const withConvertToDomainOption = !isPreviewerOrLockedViewer && canConvertProjectToDomain && withConvertToDomain;

  if (!canvas) {
    return [
      ...Utils.array.conditionalItem(withRenameOption, { label: 'Rename', onClick: onRename }),

      ...Utils.array.conditionalItem(withDuplicateOption, { label: 'Duplicate', onClick: onDuplicate }),

      ...Utils.array.conditionalItem(withDownloadOption, { label: 'Download (.vf)', onClick: onExport }),

      ...Utils.array.conditionalItem(withCopyCloneLinkOption, { label: 'Copy clone link', onClick: onClone }),

      ...Utils.array.conditionalItem(withConvertToDomainOption, { label: 'Convert to domain', onClick: onCovertToDomain }),

      ...Utils.array.conditionalItem(
        withRenameOption || withDuplicateOption || withDownloadOption || withCopyCloneLinkOption || withConvertToDomainOption,
        { label: 'divider-1', divider: true }
      ),

      ...Utils.array.conditionalItem(withInviteOption && canAddCollaboratorsV2, {
        label: 'Manage access',
        onClick: () => projectID && projectMembersModal.openVoid({ projectID }),
      }),

      ...Utils.array.conditionalItem(withSettingsOption, { label: 'Settings', onClick: () => goToSettings(targetVersionID) }),

      ...Utils.array.conditionalItem(withDeleteOption, { label: 'divider-2', divider: true }, { label: 'Delete', onClick: onDelete }),
    ];
  }

  return [
    ...Utils.array.conditionalItem(withHistoryOption, { label: 'Version history', onClick: () => targetVersionID && goToVersions(targetVersionID) }),

    ...Utils.array.conditionalItem(withSettingsOption, { label: 'Assistant settings', onClick: () => goToSettings(targetVersionID) }),

    ...Utils.array.conditionalItem(withInviteOption, { label: 'Invite collaborators', onClick: () => sharePopper?.open(ShareProjectTab.INVITE) }),

    ...Utils.array.conditionalItem(withExportOption, { label: 'Export as...', onClick: () => sharePopper?.open(ShareProjectTab.EXPORT) }),

    ...Utils.array.conditionalItem(
      (withHistoryOption || withSettingsOption || withInviteOption || withExportOption) && (withRenameOption || withDuplicateOption),
      {
        label: 'divider-1',
        divider: true,
      }
    ),

    ...Utils.array.conditionalItem(withRenameOption, { label: 'Rename assistant', onClick: onRename }),

    ...Utils.array.conditionalItem(
      withDuplicateOption,
      { label: 'Duplicate assistant', onClick: onDuplicate },
      { label: 'Copy clone link', onClick: onClone }
    ),

    ...Utils.array.conditionalItem(withConvertToDomainOption, { label: 'Convert to domain', onClick: onCovertToDomain }),

    ...Utils.array.conditionalItem(withDeleteOption, { label: 'divider-2', divider: true }, { label: 'Delete assistant', onClick: onDelete }),
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
