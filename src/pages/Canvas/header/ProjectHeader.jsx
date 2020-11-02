import React from 'react';

import Button from '@/components/Button';
import Text from '@/components/Text';
import { DiagramState, ModalType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';

import ActionGroup from './ActionGroup';

const getStateLabel = (state) => {
  switch (state) {
    case DiagramState.CHANGED:
    case DiagramState.SAVING:
      return 'Saving...';
    case DiagramState.SAVED:
      return 'Saved';
    default:
      return '';
  }
};

const ProjectHeader = ({ isTemplateWorkspace, projectId, diagramState }) => {
  const { open: openImportModal } = useModals(ModalType.IMPORT_PROJECT);

  const openCloneModal = async () => {
    openImportModal({ projectID: projectId, cloning: true });
  };

  return isTemplateWorkspace ? (
    <Button onClick={openCloneModal} icon="flows" iconProps={{ size: 13 }}>
      Clone Project
    </Button>
  ) : (
    <>
      {diagramState === DiagramState.IDLE}

      <Text fontSize={13} color="#8da2b5" mr={24}>
        {getStateLabel(diagramState)}
      </Text>

      <ActionGroup />
    </>
  );
};

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
  projectId: Skill.activeProjectIDSelector,
  diagramState: Creator.diagramStateSelector,
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHeader);
