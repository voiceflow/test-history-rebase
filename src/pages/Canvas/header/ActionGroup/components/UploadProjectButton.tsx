import React from 'react';

import { PlatformType } from '@/constants';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import Alexa from '@/pages/Canvas/header/ActionGroup/Alexa/index';
import Google from '@/pages/Canvas/header/ActionGroup/Google/index';

type UploadProjectButtonType = {
  platform: PlatformType;
};

const UploadProjectButton: React.FC<UploadProjectButtonType> = ({ platform }) => {
  const PlatformButton = platform === PlatformType.ALEXA ? Alexa : Google;
  return <PlatformButton />;
};

const mapStateToProps = {
  platform: activePlatformSelector,
};

export default connect(mapStateToProps)(UploadProjectButton);
