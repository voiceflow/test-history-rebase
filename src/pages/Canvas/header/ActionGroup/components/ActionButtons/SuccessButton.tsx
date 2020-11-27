import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';

const SuccessButton = () => {
  return (
    <TippyTooltip title="Successfully Uploaded" position="bottom">
      <IconButton preventFocusStyle variant={IconButtonVariant.SUCCESS} icon="greenCheckMark" large active={false} />
    </TippyTooltip>
  );
};

export default SuccessButton;
