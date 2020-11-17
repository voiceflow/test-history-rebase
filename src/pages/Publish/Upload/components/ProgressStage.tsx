import React from 'react';

import Box from '@/components/Box';
import Progress from '@/components/Progress';
import { BlockText } from '@/components/Text';

import StageContainer from './StageContainer';

export type ProgressStageProps = {
  progress: number;
};

const ProgressStage: React.FC<ProgressStageProps> = ({ children, progress }) => (
  <StageContainer>
    <Box mt={8}>
      <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={progress} />
    </Box>

    {children && (
      <BlockText textAlign="center" mt={16} mb={8}>
        {children}
      </BlockText>
    )}
  </StageContainer>
);

export default ProgressStage;
