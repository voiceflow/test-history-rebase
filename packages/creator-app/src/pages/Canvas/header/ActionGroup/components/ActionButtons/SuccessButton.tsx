import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

const SuccessButton = () => (
  <TippyTooltip title="Successfully Uploaded" position="bottom">
    <IconButton variant={IconButtonVariant.SUCCESS} icon="greenCheckMark" size={16} large active={false} />
  </TippyTooltip>
);

export default SuccessButton;
