import { Box, LoadingSpinner, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

export const DocumentStatusLoading: React.FC = () => {
  return (
    <Tooltip
      placement="top"
      width={165}
      referenceElement={({ onToggle, ref }) => (
        <Box onMouseEnter={onToggle} onMouseLeave={onToggle} ref={ref}>
          <LoadingSpinner size="medium" variant="dark" />
        </Box>
      )}
    >
      {() => <Text variant="caption">Parsing document and processing vectors.</Text>}
    </Tooltip>
  );
};
