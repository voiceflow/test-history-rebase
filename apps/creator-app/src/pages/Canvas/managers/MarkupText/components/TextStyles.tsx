import { System } from '@voiceflow/ui';
import React from 'react';

import { TextItalicButton, TextUnderlineButton } from '@/components/SlateEditable';

const TextStyles: React.FC = () => (
  <>
    <TextItalicButton component={System.IconButton.Base} />

    <TextUnderlineButton component={System.IconButton.Base} />
  </>
);

export default TextStyles;
