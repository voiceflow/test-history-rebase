import React from 'react';

import { PlatformType } from '@/constants';
import { activePlatformSelector, setActivePlatform } from '@/ducks/skill';
import { connect } from '@/hocs';

import ActionGroup from './ActionGroup';
import PlatformToggle from './PlatformToggle';

const ProjectHeader = ({ platform, setActivePlatform }) => (
  <>
    <PlatformToggle
      platform={platform}
      onToggle={() => setActivePlatform(platform === PlatformType.GOOGLE ? PlatformType.ALEXA : PlatformType.GOOGLE)}
    />
    <ActionGroup />
  </>
);

export default connect(
  { platform: activePlatformSelector },
  { setActivePlatform }
)(ProjectHeader);
