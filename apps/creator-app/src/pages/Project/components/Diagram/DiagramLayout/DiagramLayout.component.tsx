import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { containerStyle } from './DiagramLayout.css';
import { DiagramLayoutHeader } from './DiagramLayoutHeader/DiagramLayoutHeader.component';

export const DiagramLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box direction="column" className={containerStyle}>
      <DiagramLayoutHeader />

      {children}
    </Box>
  );
};
