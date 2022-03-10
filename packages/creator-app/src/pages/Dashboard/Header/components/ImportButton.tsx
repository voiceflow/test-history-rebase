import { IconButton, IconButtonVariant, TippyTooltip, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveWorkspace, useDispatch, useFeature, useModals, useSelector } from '@/hooks';
import { readFileAsync, upload } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const projects = useSelector(ProjectV2.allProjectsSelector);

  const goToCanvas = useDispatch(Router.goToCanvas);
  const importProject = useDispatch(Project.importProjectFromFile);
  const loadProjectLists = useDispatch(ProjectList.loadProjectLists);

  const workspace = useActiveWorkspace();

  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);

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
          <ToastCallToAction onClick={() => goToCanvas(newProject.versionID)}>Open Project</ToastCallToAction>
        </>
      );

      if (!atomicActions.isEnabled) {
        // reload project list just to be sure
        loadProjectLists(workspace.id);
      }
    } catch (err) {
      Sentry.error(err);
      toast.error('.VF file failed to import');
    }
  };

  const onClickHandler = () => {
    if (!!workspace && projects.length >= workspace.projects) {
      openProjectLimitModal({ projects: workspace.projects });
    } else {
      upload(onUpload, { accept: ACCEPTED_FILE_FORMATS });
    }
  };

  return (
    <TippyTooltip title="Import .vf file" position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.OUTLINE} icon="download" large onClick={onClickHandler} />
    </TippyTooltip>
  );
};

export default ImportButton;
