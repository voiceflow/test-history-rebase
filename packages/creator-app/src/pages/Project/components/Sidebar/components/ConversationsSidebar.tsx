import React from 'react';

import CanvasIconMenu from './CanvasIconMenu';
import FixedHeaderOffsetContainer from './FixedHeaderOffsetContainer';

const ConversationsSidebar: React.FC = () => (
  <FixedHeaderOffsetContainer>
    <CanvasIconMenu />
  </FixedHeaderOffsetContainer>
);

export default ConversationsSidebar;
