import React from 'react';

import { TextItalicButton, TextUnderlineButton } from '@/components/SlateEditable';

import Button from './Button';

const TextStyles: React.OldFC = () => (
  <>
    <TextItalicButton component={Button} />

    <TextUnderlineButton component={Button} />
  </>
);

export default TextStyles;
