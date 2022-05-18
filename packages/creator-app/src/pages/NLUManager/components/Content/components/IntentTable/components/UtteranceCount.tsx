import { Box } from '@voiceflow/ui';
import React from 'react';

interface UtteranceCountProps {
  count: number;
  flex: number;
}

const UtteranceCount: React.FC<UtteranceCountProps> = ({ count, flex }) => {
  return (
    <Box flex={flex}>
      <Box width={80} textAlign="right">
        {count}
      </Box>
    </Box>
  );
};

export default UtteranceCount;
