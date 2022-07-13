import { BaseModels } from '@voiceflow/base-types';
import { MenuOption, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { ConfirmProps } from '@/components/ConfirmModal';
import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { useModals } from '@/hooks/modals';
import { usePermission, usePermissions } from '@/hooks/permission';
import { ShareProjectTab } from '@/pages/Project/components/Header/constants';
import { SharePopperContext } from '@/pages/Project/components/Header/contexts';
import { copy } from '@/utils/clipboard';
import * as Sentry from '@/vendors/sentry';

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
        onGoToDashboard();

        await onDeleteProject(projectID);
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
          This action can not be undone, <b>"{projectName}"</b> and all flows can not be recovered
        </>
      ),
      header: 'Delete Project',

      confirm: handleDelete,
    });
  }, [canManageProjects, projectName, handleDelete]);
};

export const useProjectOptions = ({
  boardID,
  onRename,
  projectID,
  projectName,
  onDuplicated,
  versionID,
}: {
  boardID?: string;
  onRename?: () => void;
  projectID?: string | null;
  projectName?: string | null;
  onDuplicated?: () => void;
  versionID?: string;
}): MenuOption<undefined>[] => {
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);
  const canExportProject = usePermissions([Permission.CANVAS_EXPORT, Permission.MODEL_EXPORT, Permission.CODE_EXPORT]);

  const workspace = useActiveWorkspace();
  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const getProjectByID = useSelector(ProjectV2.getProjectByIDSelector);
  const sharePopper = React.useContext(SharePopperContext);
  const currentVersionID = useSelector(Session.activeVersionIDSelector);

  const duplicateProject = useDispatch(Workspace.duplicateProject);
  const goToVersions = useDispatch(Router.goToVersions);
  const updateProjectPrivacy = useDispatch(Project.updateProjectPrivacy);

  const targetVersionID = versionID || currentVersionID;

  const { open: onOpenCloneModal } = useModals(ModalType.IMPORT_PROJECT);
  const { toggle: onToggleLoadingModal } = useModals(ModalType.LOADING);
  const { open: onOpenProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { open: onOpenProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);

  const onDelete = useDeleteProject({ boardID, projectID, projectName });

  const [trackingEvents] = useTrackingEvents();

  const onDuplicate = React.useCallback(async () => {
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

    if (projectsCount >= workspace.projects) {
      onOpenProjectLimitModal({ projects: workspace.projects });
      return;
    }

    onToggleLoadingModal(true);

    trackingEvents.trackProjectDuplicate({ versionID: getProjectByID({ id: projectID })?.versionID, projectID });

    await duplicateProject(projectID, workspace.id, boardID);

    onToggleLoadingModal(false);
    onDuplicated?.();
  }, [boardID, getProjectByID, onDuplicated, projectsCount, workspace, onToggleLoadingModal, onOpenProjectLimitModal]);

  const onClone = React.useCallback(async () => {
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
      onOpenProjectDownloadModal();
    }
  }, [projectID, canShareProject, onOpenProjectDownloadModal]);

  const onCloneProject = React.useCallback(() => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    onOpenCloneModal({ cloning: true, projectID });
  }, [onOpenCloneModal, projectID]);

  const onVersionHistory = React.useCallback(() => {
    goToVersions(targetVersionID!);
  }, [targetVersionID]);

  return React.useMemo<MenuOption<undefined>[]>(
    () => [
      ...(canManageProjects && targetVersionID ? [{ label: 'Version history', onClick: onVersionHistory }] : []),
      ...(canExportProject && sharePopper
        ? [
            { label: 'Export as...', onClick: () => sharePopper.open(ShareProjectTab.EXPORT) },
            { label: 'Divider', divider: true },
          ]
        : []),
      ...(canManageProjects && onRename ? [{ label: 'Rename project', onClick: onRename }] : []),
      ...(canManageProjects
        ? [
            { label: 'Duplicate project', onClick: onDuplicate },
            { label: 'Copy clone link', onClick: onClone },
          ]
        : []),
      ...(canManageProjects
        ? [
            { label: 'Divider', divider: true },
            { label: 'Delete project', onClick: onDelete },
          ]
        : []),
    ],
    [onRename, onDuplicate, onClone, canManageProjects, onCloneProject, onDelete, onVersionHistory]
  );
};
