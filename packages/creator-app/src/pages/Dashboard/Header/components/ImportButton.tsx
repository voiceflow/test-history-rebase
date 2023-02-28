import { datadogRum } from '@datadog/browser-rum';
import { IconButton, IconButtonVariant, SvgIcon, TippyTooltip, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { LimitType } from '@/constants/limits';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { readFileAsync, upload } from '@/utils/dom';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

interface ImportButtonProps {
  dashboardV2?: boolean;
}

const ImportButton: React.FC<ImportButtonProps> = ({ dashboardV2 }) => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);

  const goToDomain = useDispatch(Router.goToDomain);
  const importProject = useDispatch(Project.importProjectFromFile);

  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    if (!workspaceID) {
      datadogRum.addError(Errors.noActiveWorkspaceID());
      toast.genericError();

      return;
    }

    try {
      const file = await readFileAsync(files[0]);

      const newProject = await importProject(workspaceID, file);

      toast.success(
        <>
          .VF file successfully imported for <strong>"{newProject.name}"</strong>
          <ToastCallToAction onClick={() => goToDomain({ versionID: newProject.versionID })}>Open Assistant</ToastCallToAction>
        </>
      );
    } catch (err) {
      datadogRum.addError(err);
      toast.error('.VF file failed to import');
    }
  };

  const onImport = usePlanLimitedAction(LimitType.PROJECTS, {
    value: projectsCount,
    limit: projectsLimit,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal(config.payload)),
    onAction: () => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS }),
  });

  return (
    <TippyTooltip content="Import .vf file" position="bottom">
      {dashboardV2 ? (
        <SvgIcon icon="importCircle" size={16} onClick={onImport} />
      ) : (
        <IconButton preventFocusStyle variant={IconButtonVariant.OUTLINE} icon="download" large onClick={onImport} />
      )}
    </TippyTooltip>
  );
};

export default ImportButton;
