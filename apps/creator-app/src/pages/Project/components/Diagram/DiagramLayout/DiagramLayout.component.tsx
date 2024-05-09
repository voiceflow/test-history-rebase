import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { containerStyle } from './DiagramLayout.css';
import { DiagramLayoutHeader } from './DiagramLayoutHeader/DiagramLayoutHeader.component';

interface IDiagramLayout extends React.PropsWithChildren {}

export const DiagramLayout: React.FC<IDiagramLayout> = ({ children }) => {
  return (
    <Box direction="column" className={containerStyle}>
      <DiagramLayoutHeader />

      {children}
    </Box>
  );
};
