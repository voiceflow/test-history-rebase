import type { DraftJsBlockStyleButtonProps } from '@voiceflow/draft-js-buttons';
import { ItalicButton, UnderlineButton } from '@voiceflow/draft-js-buttons';
import React from 'react';

import IconButton from './IconButton';

const TextStyles: React.FC<Omit<DraftJsBlockStyleButtonProps, 'children'>> = (props) => (
  <>
    <ItalicButton {...props}>{({ isActive, ...buttonProps }) => <IconButton {...buttonProps} icon="italic" active={isActive} />}</ItalicButton>

    <UnderlineButton {...props}>
      {({ isActive, ...buttonProps }) => <IconButton {...buttonProps} icon="underline" active={isActive} />}
    </UnderlineButton>
  </>
);

export default TextStyles;
