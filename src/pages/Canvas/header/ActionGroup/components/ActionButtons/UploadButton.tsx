import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { createPlatformSelector } from '@/utils/platform';

type UploadButtonProps = {
  isJobActive: boolean;
  onClick: () => void;
};

const getUploadMessage = createPlatformSelector(
  {
    [PlatformType.ALEXA]: 'Upload to Alexa',
    [PlatformType.GOOGLE]: 'Upload to Google',
  },
  ''
);

const UploadButton: React.FC<UploadButtonProps & ConnectedUploadButtonProps> = ({ isJobActive, platform, onClick }) => (
  <TippyTooltip title={getUploadMessage(platform)} position="bottom">
    <IconButton preventFocusStyle variant={IconButtonVariant.ACTION} icon="loader" large onClick={onClick} active={isJobActive} />
  </TippyTooltip>
);

const mapStateToProps = {
  platform: Project.activePlatformSelector,
};

type ConnectedUploadButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(UploadButton) as React.FC<UploadButtonProps>;
