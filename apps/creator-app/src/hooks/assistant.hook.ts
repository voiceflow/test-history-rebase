import { datadogRum } from '@datadog/browser-rum';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { notify } from '@voiceflow/ui-next';

import PageProgressBar, { PageProgress } from '@/components/PageProgressBar';
import * as Errors from '@/config/errors';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import { Organization, Project, Session, Workspace } from '@/ducks';
import { clipboardCopyWithToast } from '@/utils/clipboard.util';

import { useProjectDownloadModal, useUpgradeModal } from './modal.hook';
import { usePermission } from './permission';
import { usePlanLimitedAction } from './planLimitV2';
import { useConditionalLimitAction } from './planLimitV3';
import { useDispatch, useSelector } from './store.hook';
import { useTrackingEvents } from './tracking';

export const useOnAssistantCopyCloneLink = (projectID: string | null) => {
  const [trackingEvents] = useTrackingEvents();
  const [canShareProject] = usePermission(Permission.FEATURE_SHARE_PROJECT);
  const projectDownloadModal = useProjectDownloadModal();

  const updateProjectPrivacy = useDispatch(Project.updateProjectPrivacy);

  return async () => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      notify.short.genericError();
      return;
    }

    if (!canShareProject) {
      projectDownloadModal.openVoid();
      return;
    }

    try {
      clipboardCopyWithToast(`${window.location.origin}/dashboard?import=${projectID}`)();

      updateProjectPrivacy(projectID, BaseModels.Project.Privacy.PUBLIC);

      trackingEvents.trackActiveProjectDownloadLinkShare();
    } catch {
      notify.short.error('Error getting import link');
    }
  };
};

export const useOnAssistantDuplicate = (projectID: string | null, { boardID }: { boardID?: string } = {}) => {
  const upgradeModal = useUpgradeModal();

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const projectsCount = useSelector(Project.projectsCountSelector);
  const projectsLimit = useSelector(Workspace.active.projectsLimitSelector);

  const duplicateProject = useDispatch(Project.duplicateProject);

  const onDuplicateAction = async () => {
    if (!workspaceID) {
      datadogRum.addError(Errors.noActiveWorkspaceID());
      notify.short.genericError();
      return;
    }

    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
      notify.short.genericError();
      return;
    }

    try {
      const toastID = Utils.id.cuid();

      notify.short.info('Duplicating', { isLoading: true, autoClose: 1000, toastId: toastID });
      PageProgress.start(PageProgressBar.ASSISTANT_DUPLICATING);

      await duplicateProject(projectID, workspaceID, boardID);

      notify.short.dismiss(toastID);
      notify.short.success('Duplicated');
    } catch {
      notify.short.error('Duplicating failed, please try again later or contact support');
    } finally {
      PageProgress.stop(PageProgressBar.ASSISTANT_DUPLICATING);
    }
  };

  const legacyOnDuplicate = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projectsCount,
    limit: projectsLimit,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),

    onAction: onDuplicateAction,
  });

  const newOnDuplicate = useConditionalLimitAction(LimitType.PROJECTS, {
    value: projectsCount,
    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: onDuplicateAction,
  });

  return subscription ? newOnDuplicate : legacyOnDuplicate;
};
