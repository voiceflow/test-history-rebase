import { datadogRum } from '@datadog/browser-rum';
import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { MenuTypes } from '@voiceflow/ui';
import { toast, Utils } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { ALEXA_SUNSET_PROJECT_ID, ExportFormat as CanvasExportFormat } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Export from '@/ducks/export';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useIsLockedProjectViewer, useIsPreviewer, usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';
import { copy } from '@/utils/clipboard';

import { useOnAssistantDuplicate } from './assistant.hook';
import { useFeature } from './feature.hook';
import { useDispatch } from './realtime';
import { useTrackingEvents } from './tracking';

export const useDeleteProject = ({
  boardID,
  projectID,
}: {
  boardID?: string;
  projectID?: string | null;
}): (() => void) => {
  const [canManageProjects] = usePermission(Permission.WORKSPACE_PROJECTS_MANAGE);

  const deleteModal = ModalsV2.useModal(ModalsV2.Project.Delete);

  return React.useCallback(() => {
    if (!canManageProjects || !projectID) return;

    deleteModal.open({ projectID, boardID });
  }, [canManageProjects]);
};

interface ProjectOption extends MenuTypes.Option {
  testID?: string;
}

export const useProjectOptions = ({
  boardID,
  onRename,
  versionID,
  projectID = null,
  withDelete = true,
  withInvite = false,
}: {
  boardID?: string;
  onRename?: () => void;
  versionID?: string;
  projectID?: string | null;
  withDelete?: boolean;
  withInvite?: boolean;
}): ProjectOption[] => {
  const isPreviewer = useIsPreviewer();
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const [canEditProject] = usePermission(Permission.PROJECT_UPDATE);
  const [canManageProjects] = usePermission(Permission.WORKSPACE_PROJECTS_MANAGE);
  const [canAddCollaborators] = usePermission(Permission.WORKSPACE_MEMBER_ADD);
  const isLockedProjectViewer = useIsLockedProjectViewer();

  const currentVersionID = useSelector(Session.activeVersionIDSelector);
  const project = useSelector(ProjectV2.projectByIDSelector, { id: projectID });

  const platformConfig = Platform.Config.get(project?.platform);
  const isProjectLocked = isLockedProjectViewer || platformConfig.isDeprecated;

  const goToSettings = useDispatch(Router.goToSettings);

  const updateProjectPrivacy = useDispatch(ProjectV2.updateProjectPrivacy);
  const exportCanvas = useDispatch(Export.exportCanvas);

  const projectMembersModal = ModalsV2.useModal(ModalsV2.Project.Members);

  const onDelete = useDeleteProject({ boardID, projectID });

  const [trackingEvents] = useTrackingEvents();

  const onDuplicate = useOnAssistantDuplicate(projectID, { boardID });

  const onClone = async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      copy(`${window.location.origin}/dashboard?import=${projectID}`);

      toast.success('Copied to clipboard');

      trackingEvents.trackActiveProjectDownloadLinkShare();

      updateProjectPrivacy(projectID, BaseModels.Project.Privacy.PUBLIC);
    } catch {
      toast.error('Error getting import link');
    }
  };

  const onExport = async () => {
    trackingEvents.trackExportButtonClick({ format: CanvasExportFormat.VF });

    await exportCanvas({ type: CanvasExportFormat.VF, versionID, projectID });
  };

  const targetVersionID = versionID || currentVersionID;

  const isPreviewerOrLockedViewer = isPreviewer || isProjectLocked;
  const withInviteOption = !isPreviewerOrLockedViewer && withInvite && canAddCollaborators;
  const withDeleteOption = !isPreviewer && withDelete && canManageProjects;
  const withRenameOption = !isPreviewerOrLockedViewer && canEditProject && !!onRename;
  const withSettingsOption = !isPreviewerOrLockedViewer && canEditProject && !!targetVersionID;
  const withDownloadOption = !isPreviewer && !hideExports;
  const withDuplicateOption = !isPreviewerOrLockedViewer && canManageProjects;
  const withCopyCloneLinkOption = !isPreviewer && !isProjectLocked && canManageProjects && !hideExports;
  const hasDivider1 =
    (withRenameOption || withDuplicateOption || withDownloadOption || withCopyCloneLinkOption) &&
    ((withInviteOption && canAddCollaborators) || withSettingsOption);

  return [
    ...Utils.array.conditionalItem(withRenameOption, { label: 'Rename', onClick: onRename, testID: 'rename' }),

    ...Utils.array.conditionalItem(withDuplicateOption, {
      label: 'Duplicate',
      onClick: onDuplicate,
      testID: 'duplicate',
    }),

    ...Utils.array.conditionalItem(withDownloadOption, {
      label: 'Download (.vf)',
      onClick: onExport,
      testID: 'download',
    }),

    ...Utils.array.conditionalItem(withCopyCloneLinkOption, {
      label: 'Copy clone link',
      onClick: onClone,
      testID: 'copy-clone-link',
    }),

    ...Utils.array.conditionalItem(hasDivider1, { label: 'divider-1', divider: true }),

    ...Utils.array.conditionalItem(withInviteOption && canAddCollaborators, {
      label: 'Manage access',
      onClick: () => projectID && projectMembersModal.openVoid({ projectID }),
      testID: 'manage-access',
    }),

    ...Utils.array.conditionalItem(withSettingsOption, {
      label: 'Settings',
      onClick: () => goToSettings(targetVersionID),
      testID: 'settings',
    }),

    ...Utils.array.conditionalItem(
      withDeleteOption,
      { label: 'divider-2', divider: true },
      { label: 'Delete', onClick: onDelete, testID: 'delete' }
    ),
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

  const updateProjectLiveVersion = useDispatch(ProjectV2.updateProjectLiveVersion);

  React.useEffect(() => {
    if (!activeProjectID) return;

    (async () => {
      const { liveVersion } = await client.api.project.get(activeProjectID!, ['liveVersion']);
      updateProjectLiveVersion(activeProjectID, liveVersion!);
    })();
  }, []);
};
