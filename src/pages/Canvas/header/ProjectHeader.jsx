import React from 'react';
import { Tooltip } from 'react-tippy';
import { ActionCreators } from 'redux-undo';

import { PlatformType } from '@/constants';
import { activePlatformSelector, setActivePlatform } from '@/ducks/skill';
import { connect } from '@/hocs';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { projectViewerCountSelector } from '@/store/selectors';

import ActionGroup from './ActionGroup';
import PlatformToggle from './PlatformToggle';

const ProjectHeader = ({ platform, togglePlatform, projectViewerCount }) => {
  const hasViewers = projectViewerCount > 1;
  const { isViewer } = React.useContext(EditPermissionContext);
  const toggle = <PlatformToggle platform={platform} onToggle={togglePlatform} disabled={hasViewers || isViewer} />;

  return (
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
