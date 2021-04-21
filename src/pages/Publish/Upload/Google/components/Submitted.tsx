import React from 'react';

import { takeoffGraphic } from '@/assets';
import Box from '@/components/Box';

import { StageContainer } from '../../components';

const Submitted = () => (
  <StageContainer>
    <img id="rocket" alt="submitted" height={120} src={takeoffGraphic} />

    <Box mt={24} color="#8da2b5" px={16}>
      Your project has been submitted for review. During this time you will see the action with the "Review" status.
    </Box>
  </StageContainer>
);

export default Submitted;
