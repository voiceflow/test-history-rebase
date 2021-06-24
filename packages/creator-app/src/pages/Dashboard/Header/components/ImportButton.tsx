import { IconButton, IconButtonVariant, TippyTooltip, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { ConnectedProps } from '@/types';
import { readFileAsync, upload } from '@/utils/dom';
import * as Sentry from '@/vendors/sentry';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC<ConnectedImportButton> = ({ workspaceID, importProject, loadProjectLists, workspace, projects, goToCanvas }) => {
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);

  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    if (!workspaceID) {
      Sentry.error(Errors.noActiveWorkspaceID());
      toast.genericError();

      return;
    }

    try {
      const file = await readFileAsync(files[0]);

      const newProject = await importProject(workspaceID, file);
      toast.success(
        <>
          .VF file successfully imported
          <ToastCallToAction onClick={() => goToCanvas(newProject.versionID)}>Open Project</ToastCallToAction>
        </>
      );

      // reload project list just to be sure
      loadProjectLists(workspaceID);
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

const mapStateToProps = {
  workspaceID: Session.activeWorkspaceIDSelector,
  workspace: Workspace.activeWorkspaceSelector,
  projects: Project.allProjectsSelector,
};

const mapDispatchToProps = {
  importProject: Project.importProjectFromFile,
  loadProjectLists: ProjectList.loadProjectLists,
  goToCanvas: Router.goToCanvas,
};

type ConnectedImportButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ImportButton);
