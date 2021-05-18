import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { PlatformType } from '@/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
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

const UploadButton: React.FC<UploadButtonProps> = ({ isJobActive, onClick }) => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <TippyTooltip title={getUploadMessage(platform)} position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.ACTION} icon="loader" large onClick={onClick} active={isJobActive} />
    </TippyTooltip>
  );
};

export default UploadButton;
