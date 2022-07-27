import React from 'react';

import { SideBarComponentProps } from '../types';
import CanvasIconMenu from './CanvasIconMenu';
import FixedHeaderOffsetContainer from './FixedHeaderOffsetContainer';

const ConversationsSidebar: React.FC<SideBarComponentProps> = () => (
  <FixedHeaderOffsetContainer>
    <CanvasIconMenu />
  </FixedHeaderOffsetContainer>
);

export default ConversationsSidebar;
