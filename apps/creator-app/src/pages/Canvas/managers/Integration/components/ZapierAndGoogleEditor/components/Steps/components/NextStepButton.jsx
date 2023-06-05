import { Box, Button } from '@voiceflow/ui';
import React from 'react';

const NextStepButton = ({ openNextStep }) => (
  <Box textAlign="center" mb={12}>
    <Button onClick={() => openNextStep()}>Next</Button>
  </Box>
);

export default NextStepButton;
