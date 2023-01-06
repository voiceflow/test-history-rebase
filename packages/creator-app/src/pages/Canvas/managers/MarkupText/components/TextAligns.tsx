import React from 'react';

import { ElementAlignCenterButton, ElementAlignLeftButton, ElementAlignRightButton } from '@/components/SlateEditable';

import Button from './Button';

const TextAligns: React.OldFC = () => (
  <>
    <ElementAlignLeftButton component={Button} />

    <ElementAlignCenterButton component={Button} />

    <ElementAlignRightButton component={Button} />
  </>
);

export default TextAligns;
