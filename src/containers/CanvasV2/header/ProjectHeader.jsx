import React from 'react';
import { ActionCreators } from 'redux-undo';

import { PlatformType } from '@/constants';
import { activePlatformSelector, setActivePlatform } from '@/ducks/skill';
import { connect } from '@/hocs';

import ActionGroup from './ActionGroup';
import PlatformToggle from './PlatformToggle';

const ProjectHeader = ({ platform, togglePlatform }) => (
  <>
    <PlatformToggle platform={platform} onToggle={togglePlatform} />
    <ActionGroup />
  </>
);

const mapStateToProps = {
  platform: activePlatformSelector,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProjectHeader);
