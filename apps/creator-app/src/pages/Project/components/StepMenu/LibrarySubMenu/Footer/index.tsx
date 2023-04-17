import React from 'react';

import { StyledAction } from './components';

export interface LibrarySubMenuFooterProps {
  openCustomBlocksEditorModal: VoidFunction;
}

const LibrarySubMenuFooter: React.FC<LibrarySubMenuFooterProps> = ({ openCustomBlocksEditorModal }) => (
  <StyledAction onClick={openCustomBlocksEditorModal}>Add Custom Block</StyledAction>
);

export default LibrarySubMenuFooter;
