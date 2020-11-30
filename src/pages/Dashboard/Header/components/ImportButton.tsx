import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { ClickableText } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import { toast } from '@/components/Toast';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { readFileAsync, upload } from '@/utils/dom';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC<ConnectedImportButton> = ({ workspaceID, importProject, loadProjectLists, goToCanvas }) => {
  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    try {
      const file = await readFileAsync(files[0]);

      const newProject = await importProject(workspaceID!, file);
      toast.success(
        <>
          .VF file successfully imported
          <ClickableText onClick={() => goToCanvas(newProject.versionID)}>Open Project</ClickableText>
        </>
      );

      // reload project list just to be sure
      loadProjectLists(workspaceID!);
    } catch (err) {
      console.error(err);
      toast.error('.VF file failed to import');
    }
  };

  return (
    <TippyTooltip title="Import" position="bottom">
      <IconButton
        preventFocusStyle
        variant={IconButtonVariant.OUTLINE}
        icon="download"
        large
        onClick={() => upload(onUpload, { accept: ACCEPTED_FILE_FORMATS })}
      />
    </TippyTooltip>
  );
};

const mapStateToProps = {
  workspaceID: Workspace.activeWorkspaceIDSelector,
};

const mapDispatchToProps = {
  importProject: Project.importProject,
  loadProjectLists: ProjectList.loadProjectLists,
  goToCanvas: Router.goToCanvas,
};

type ConnectedImportButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ImportButton);
