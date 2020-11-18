import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';

type UploadButtonProps = {
  isJobActive: boolean;
  onClick: () => void;
};

const UploadButton: React.FC<UploadButtonProps> = ({ isJobActive, onClick }) => {
  return (
    <TippyTooltip title="Upload" position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.ACTION} icon="loader" large onClick={onClick} active={isJobActive} />
    </TippyTooltip>
  );
};

export default UploadButton as React.FC<UploadButtonProps>;
