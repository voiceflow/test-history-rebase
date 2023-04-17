import { System } from '@voiceflow/ui';
import React from 'react';

import { ElementAlignCenterButton, ElementAlignLeftButton, ElementAlignRightButton } from '@/components/SlateEditable';

const TextAligns: React.FC = () => (
  <>
    <ElementAlignLeftButton component={System.IconButton.Base} />

    <ElementAlignCenterButton component={System.IconButton.Base} />

    <ElementAlignRightButton component={System.IconButton.Base} />
  </>
);

export default TextAligns;
