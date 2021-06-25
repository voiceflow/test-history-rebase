import { ProjectPrivacy } from '@voiceflow/api-sdk';
import { MenuOption, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { ConfirmProps } from '@/components/ConfirmModal';
import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { useModals } from '@/hooks/modals';
import { usePermission } from '@/hooks/permission';
import { copy } from '@/utils/clipboard';
import * as Sentry from '@/vendors/sentry';

import { useDispatch } from './redux';
import { useTrackingEvents } from './tracking';

// eslint-disable-next-line import/prefer-default-export
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

  const onDeleteProject = useDispatch(Project.deleteProject);
  const onGoToDashboard = useDispatch(Router.goToDashboard);
  const onDeleteProjectFromList = useDispatch(ProjectList.deleteProjectFromList);

  const { open: openConfirmModal } = useModals<ConfirmProps>(ModalType.CONFIRM);

  const handleDelete = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
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
  }, [boardID, projectID, projectName]);

  return React.useCallback(() => {
    if (!canManageProjects) {
      return;
    }

    openConfirmModal({
      header: 'Delete Project',
      body: (
        <span>
          This action can not be undone, <b>"{projectName}"</b> and all flows can not be recovered
        </span>
      ),
      confirm: handleDelete,
    });
  }, [canManageProjects]);
};

export const useProjectOptions = ({
  boardID,
  onRename,
  projectID,
  projectName,
  onDuplicated,
}: {
  boardID?: string;
  onRename?: () => void;
  projectID?: string | null;
  projectName?: string | null;
  onDuplicated?: () => void;
}): MenuOption<undefined>[] => {
  const [canCloneProject] = usePermission(Permission.CLONE_PROJECT);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [canManageProjects] = usePermission(Permission.MANAGE_PROJECTS);

  const workspace = useSelector(Workspace.activeWorkspaceSelector);
  const projectsCount = useSelector(Project.projectsCountSelector);

  const copyProject = useDispatch(Workspace.copyProject);
  const saveProjectPrivacy = useDispatch(Project.saveProjectPrivacy);

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

    await copyProject(projectID, workspace.id, boardID);

    onToggleLoadingModal(false);
    onDuplicated?.();
  }, [boardID, onDuplicated, projectsCount, workspace, onToggleLoadingModal, onOpenProjectLimitModal]);

  const onDownload = React.useCallback(async () => {
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

        saveProjectPrivacy(projectID, ProjectPrivacy.PUBLIC);
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

  return React.useMemo<MenuOption<undefined>[]>(
    () => [
      ...(canManageProjects && onRename ? [{ label: 'Rename project', onClick: onRename }] : []),
      ...(canManageProjects
        ? [
            { label: 'Duplicate project', onClick: onDuplicate },
            { label: 'Copy download link', onClick: onDownload },
          ]
        : []),
      ...(canCloneProject ? [{ label: 'Clone Project', onClick: onCloneProject }] : []),
      ...(canManageProjects
        ? [
            { label: 'Divider', divider: true },
            { label: 'Delete project', onClick: onDelete },
          ]
        : []),
    ],
    [onRename, onDuplicate, onDownload, canCloneProject, canManageProjects, onCloneProject, onDelete]
  );
};
