import React from 'react';
import { Tooltip } from 'react-tippy';
import { ActionCreators } from 'redux-undo';

import client from '@/client';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { DiagramState, ModalType, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { projectViewerCountSelector } from '@/store/selectors';

import ActionGroup, { GroupContainer } from './ActionGroup';
import PlatformToggle from './PlatformToggle';

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

const ProjectHeader = ({ platform, togglePlatform, projectViewerCount, isTemplateWorkspace, projectId, diagramState }) => {
  const hasViewers = projectViewerCount > 1;
  const { isViewer } = React.useContext(EditPermissionContext);
  const toggle = <PlatformToggle platform={platform} onToggle={togglePlatform} disabled={hasViewers || isViewer} />;
  const { open: openImportModal } = useModals(ModalType.IMPORT_PROJECT);

  const openCloneModal = async () => {
    const importToken = await client.project.getImportToken(projectId);
    openImportModal({ importToken, cloning: true });
  };

  const ContentContainer = diagramState === DiagramState.IDLE ? React.Fragment : GroupContainer;

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

      <ContentContainer>
        {hasViewers ? (
          <Tooltip title="Unable to switch the platform with other active users viewing the project." theme="warning" position="bottom">
            {toggle}
          </Tooltip>
        ) : (
          toggle
        )}
      </ContentContainer>

      <ActionGroup />
    </>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  projectViewerCount: projectViewerCountSelector,
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
  projectId: Skill.activeProjectIDSelector,
  diagramState: Creator.diagramStateSelector,
};

const mapDispatchToProps = {
  togglePlatform: Skill.setActivePlatform,
  clearHistory: ActionCreators.clearHistory,
};

const mergeProps = ({ platform }, { togglePlatform, clearHistory }) => ({
  togglePlatform: () => {
    togglePlatform(platform === PlatformType.GOOGLE ? PlatformType.ALEXA : PlatformType.GOOGLE);
    clearHistory();
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectHeader);
