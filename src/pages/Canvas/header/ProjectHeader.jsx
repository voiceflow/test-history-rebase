import React from 'react';
import { Tooltip } from 'react-tippy';
import { ActionCreators } from 'redux-undo';

import client from '@/client';
import Button from '@/components/Button';
import { ModalType, PlatformType } from '@/constants';
import { activePlatformSelector, activeProjectIDSelector, setActivePlatform } from '@/ducks/skill';
import { isTemplateWorkspaceSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { projectViewerCountSelector } from '@/store/selectors';

import ActionGroup from './ActionGroup';
import PlatformToggle from './PlatformToggle';

const ProjectHeader = ({ platform, togglePlatform, projectViewerCount, isTemplateWorkspace, projectId }) => {
  const hasViewers = projectViewerCount > 1;
  const { isViewer } = React.useContext(EditPermissionContext);
  const toggle = <PlatformToggle platform={platform} onToggle={togglePlatform} disabled={hasViewers || isViewer} />;
  const { open: openImportModal } = useModals(ModalType.IMPORT_PROJECT);

  const openCloneModal = async () => {
    const importToken = await client.project.getImportToken(projectId);
    openImportModal({ importToken, cloning: true });
  };

  return isTemplateWorkspace ? (
    <Button onClick={openCloneModal}>Clone Project</Button>
  ) : (
    <>
      {hasViewers ? (
        <Tooltip title="Unable to switch the platform with other active users viewing the project." theme="warning" position="bottom">
          {toggle}
        </Tooltip>
      ) : (
        toggle
      )}
      <ActionGroup />
    </>
  );
};

const mapStateToProps = {
  platform: activePlatformSelector,
  projectViewerCount: projectViewerCountSelector,
  isTemplateWorkspace: isTemplateWorkspaceSelector,
  projectId: activeProjectIDSelector,
};

const mapDispatchToProps = {
  togglePlatform: setActivePlatform,
  clearHistory: ActionCreators.clearHistory,
};

const mergeProps = ({ platform }, { togglePlatform, clearHistory }) => ({
  togglePlatform: () => {
    togglePlatform(platform === PlatformType.GOOGLE ? PlatformType.ALEXA : PlatformType.GOOGLE);
    clearHistory();
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProjectHeader);
