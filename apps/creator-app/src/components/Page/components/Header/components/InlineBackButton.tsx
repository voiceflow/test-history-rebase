import { System } from '@voiceflow/ui';
import React from 'react';

interface InlineBackButtonProps {
  onClick: VoidFunction;
}

const InlineBackButton: React.FC<InlineBackButtonProps> = ({ onClick }) => (
  <System.IconButtonsGroup.Base ml={18} mr={8}>
    <System.IconButton.Base icon="largeArrowLeft" onClick={onClick} size={System.IconButton.Size.L} />
  </System.IconButtonsGroup.Base>
);

export default InlineBackButton;
