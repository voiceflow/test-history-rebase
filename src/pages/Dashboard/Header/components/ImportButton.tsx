import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { toast } from '@/components/Toast';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { readFileAsync, upload } from '@/utils/dom';

const ACCEPTED_FILE_FORMATS = '.vf,.vfr';

const ImportButton: React.FC<ConnectedImportButton> = ({ workspaceID, importProject, loadProjectLists }) => {
  const onUpload = async (files: FileList) => {
    if (!files.length) return;

    try {
      const file = await readFileAsync(files[0]);

      await importProject(workspaceID!, file);
      toast.success('.VF file successfully imported');

      // reload project list just to be sure
      loadProjectLists(workspaceID!);
    } catch (err) {
      console.error(err);
      toast.error('.VF file failed to import');
    }
  };

  return (
    <TippyTooltip title="Settings" position="bottom">
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
};

type ConnectedImportButton = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ImportButton);
