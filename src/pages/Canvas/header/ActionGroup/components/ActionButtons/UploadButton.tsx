import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

type UploadButtonProps = {
  isJobActive: boolean;
  onClick: () => void;
};

const UPLOAD_MESSAGE: Record<PlatformType, string> = {
  [PlatformType.ALEXA]: 'Upload to Alexa',
  [PlatformType.GOOGLE]: 'Upload to Google',
  [PlatformType.GENERAL]: '',
};

const UploadButton: React.FC<UploadButtonProps & ConnectedUploadButtonProps> = ({ isJobActive, platform, onClick }) => {
  return (
    <TippyTooltip title={UPLOAD_MESSAGE[platform]} position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.ACTION} icon="loader" large onClick={onClick} active={isJobActive} />
    </TippyTooltip>
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

type ConnectedUploadButtonProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(UploadButton) as React.FC<UploadButtonProps>;
