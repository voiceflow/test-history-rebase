import type { DraftJsBlockAlignmentButtonProps } from '@voiceflow/draft-js-buttons';
import { AlignBlockCenterButton, AlignBlockLeftButton, AlignBlockRightButton } from '@voiceflow/draft-js-buttons';
import React from 'react';

import IconButton from './IconButton';

const TextAligns: React.FC<Omit<DraftJsBlockAlignmentButtonProps, 'children'>> = (props) => {
  return (
    <>
      <AlignBlockLeftButton {...props}>
        {({ isActive, ...buttonProps }) => <IconButton {...buttonProps} active={isActive} icon="textAlignLeft" />}
      </AlignBlockLeftButton>

      <AlignBlockCenterButton {...props}>
        {({ isActive, ...buttonProps }) => <IconButton {...buttonProps} active={isActive} icon="textAlignCenter" />}
      </AlignBlockCenterButton>

      <AlignBlockRightButton {...props}>
        {({ isActive, ...buttonProps }) => <IconButton {...buttonProps} active={isActive} icon="textAlignRight" />}
      </AlignBlockRightButton>
    </>
  );
};

export default TextAligns;
