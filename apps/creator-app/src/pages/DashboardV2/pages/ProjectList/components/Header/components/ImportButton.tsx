import { datadogRum } from '@datadog/browser-rum';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { PageProgress } from '@/components/PageProgressBar';
import * as Errors from '@/config/errors';
import { PageProgressBar } from '@/constants';
import { LimitType } from '@/constants/limits';
import * as Organization from '@/ducks/organization';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, usePlanLimitedAction, useSelector } from '@/hooks';
import { useConditionalLimitAction } from '@/hooks/planLimitV3';
import * as ModalsV2 from '@/ModalsV2';
import { upload } from '@/utils/dom';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC = () => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);

  const goToDomain = useDispatch(Router.goToDomain);
  const importProject = useDispatch(ProjectV2.importProjectFromFile);
  const goToProjectCanvas = useDispatch(Router.goToProjectCanvas);

  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    if (!workspaceID) {
      datadogRum.addError(Errors.noActiveWorkspaceID());
      toast.genericError();

      return;
    }

    try {
      PageProgress.start(PageProgressBar.IMPORT_VF_FILE, { maxDuration: 3000, step: 2, stepInterval: 100 });

      const project = await importProject(workspaceID, files[0]);

      toast.success(
        <>
          .VF file successfully imported for <strong>"{project.name}"</strong>
          <ToastCallToAction
            onClick={() =>
              cmsWorkflows.isEnabled
                ? goToProjectCanvas({ versionID: project.versionID })
                : goToDomain({ versionID: project.versionID })
            }
          >
            Open Assistant
          </ToastCallToAction>
        </>
      );
    } catch (err) {
      datadogRum.addError(err);
      toast.error('.VF file failed to import');
    } finally {
      PageProgress.stop(PageProgressBar.IMPORT_VF_FILE);
    }
  };

  const legacyOnImport = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projects.length,
    limit: projectsLimit,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: () => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS }),
  });

  const newOnImport = useConditionalLimitAction(LimitType.PROJECTS, {
    value: projects.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: () => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS }),
  });

  const onImport = subscription ? newOnImport : legacyOnImport;

  return (
    <Page.Header.IconButton
      icon="importCircle"
      onClick={onImport}
      tooltip={{
        content: 'Import .vf file',
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 3] } }],
        },
      }}
    />
  );
};

export default ImportButton;
