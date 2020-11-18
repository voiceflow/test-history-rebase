import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';

type LoadingButtonProps = {
  progress: number;
  tooltipOpen: boolean;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({ progress, tooltipOpen }) => {
  return (
    <TippyTooltip
      open={tooltipOpen}
      html={
        <div>
          Uploading:<span style={{ color: 'rgba(255, 255, 255, 0.59)', marginLeft: '7px' }}>{progress || 0}%</span>
        </div>
      }
      position="bottom"
    >
      <IconButton iconProps={{ spin: true }} preventFocusStyle variant={IconButtonVariant.ACTION} icon="loader" large active={false} />
    </TippyTooltip>
  );
};

export default LoadingButton;
