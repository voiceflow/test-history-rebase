import { datadogRum } from '@datadog/browser-rum';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { PageProgress } from '@/components/PageProgressBar';
import * as Errors from '@/config/errors';
import { PageProgressBar } from '@/constants';
import { LimitType } from '@/constants/limits';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { readFileAsync, upload } from '@/utils/dom';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC = () => {
  const realtimeFileUpload = useFeature(Realtime.FeatureFlag.REALTIME_VF_FILE_IMPORT);

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);

  const goToDomain = useDispatch(Router.goToDomain);
  const importProject = useDispatch(ProjectV2.importProjectFromFile);
  const importProjectV2 = useDispatch(ProjectV2.importProjectFromFileV2);

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

      let project: Realtime.AnyProject;

      if (realtimeFileUpload.isEnabled) {
        project = await importProjectV2(workspaceID, files[0]);
      } else {
        const file = await readFileAsync(files[0]);

        project = await importProject(workspaceID, file);
      }

      toast.success(
        <>
          .VF file successfully imported for <strong>"{project.name}"</strong>
          <ToastCallToAction onClick={() => goToDomain({ versionID: project.versionID })}>Open Assistant</ToastCallToAction>
        </>
      );
    } catch (err) {
      datadogRum.addError(err);
      toast.error('.VF file failed to import');
    } finally {
      PageProgress.stop(PageProgressBar.IMPORT_VF_FILE);
    }
  };

  const onImport = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projects.length,
    limit: projectsLimit,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: () => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS }),
  });

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
