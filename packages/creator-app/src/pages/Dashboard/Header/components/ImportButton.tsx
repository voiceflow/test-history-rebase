import { IconButton, IconButtonVariant, TippyTooltip, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { LimitType } from '@/config/planLimitV2';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveWorkspace, useDispatch, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { readFileAsync, upload } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC = () => {
  const projects = useSelector(ProjectV2.allProjectsSelector);

  const goToDomain = useDispatch(Router.goToDomain);
  const importProject = useDispatch(Project.importProjectFromFile);

  const workspace = useActiveWorkspace();

  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    if (!workspace?.id) {
      Sentry.error(Errors.noActiveWorkspaceID());
      toast.genericError();

      return;
    }

    try {
      const file = await readFileAsync(files[0]);

      const newProject = await importProject(workspace.id, file);

      toast.success(
        <>
          .VF file successfully imported for <strong>"{newProject.name}"</strong>
          <ToastCallToAction onClick={() => goToDomain({ versionID: newProject.versionID })}>Open Project</ToastCallToAction>
        </>
      );
    } catch (err) {
      Sentry.error(err);
      toast.error('.VF file failed to import');
    }
  };

  const onImport = usePlanLimitedAction({
    type: LimitType.PROJECTS,
    value: projects.length,
    limit: workspace?.projects ?? 2,
    onAction: () => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS }),
    onLimited: (limit) => upgradeModal.openVoid(limit.upgradeModal),
  });

  return (
    <TippyTooltip title="Import .vf file" position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.OUTLINE} icon="download" large onClick={onImport} />
    </TippyTooltip>
  );
};

export default ImportButton;
