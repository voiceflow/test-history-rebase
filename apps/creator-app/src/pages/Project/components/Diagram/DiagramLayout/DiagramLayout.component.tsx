import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { containerStyle } from './DiagramLayout.css';
import { DiagramLayoutHeader } from './DiagramLayoutHeader/DiagramLayoutHeader.component';

interface IDiagramLayout extends React.PropsWithChildren {
  isLoader?: boolean;
}

export const DiagramLayout: React.FC<IDiagramLayout> = ({ children, isLoader }) => {
  return (
    <Box direction="column" className={containerStyle}>
      <DiagramLayoutHeader isLoader={isLoader} />

      {children}
    </Box>
  );
};
