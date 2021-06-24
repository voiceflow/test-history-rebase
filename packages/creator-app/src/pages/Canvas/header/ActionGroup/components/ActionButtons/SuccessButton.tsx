import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

const SuccessButton = () => (
  <TippyTooltip title="Successfully Uploaded" position="bottom">
    <IconButton preventFocusStyle variant={IconButtonVariant.SUCCESS} icon="greenCheckMark" large active={false} />
  </TippyTooltip>
);

export default SuccessButton;
