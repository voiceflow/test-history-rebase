import { Box } from '@voiceflow/ui';
import React from 'react';

import { takeoffGraphic } from '@/assets';

import StageContainer from './StageContainer';

const SubmittedStage = () => (
  <StageContainer>
    <img id="rocket" alt="submitted" height={120} src={takeoffGraphic} />

    <Box mt={24} color="#8da2b5" px={16}>
      Your agent has been submitted for review. During this time you will see the action with the "Review" status.
    </Box>
  </StageContainer>
);

export default SubmittedStage;
