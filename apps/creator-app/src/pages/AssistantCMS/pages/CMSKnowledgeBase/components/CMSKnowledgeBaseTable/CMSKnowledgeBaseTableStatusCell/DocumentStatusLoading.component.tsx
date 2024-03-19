import { Box, LoadingSpinner, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { ICMSKnowledgeBaseTableStatusCell } from './CMSKnowledgeBaseTableStatusCell.interface';

export const DocumentStatusLoading: React.FC<ICMSKnowledgeBaseTableStatusCell> = () => (
  <Tooltip
    placement="top"
    width={165}
    referenceElement={({ onToggle, ref }) => (
      <Box onMouseEnter={onToggle} onMouseLeave={onToggle} ref={ref} pl={4}>
        <LoadingSpinner size="medium" variant="dark" />
      </Box>
    )}
  >
    {() => <Text variant="caption">Parsing document and processing vectors.</Text>}
  </Tooltip>
);
