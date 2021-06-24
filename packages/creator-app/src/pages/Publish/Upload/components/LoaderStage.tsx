import { Box, Spinner } from '@voiceflow/ui';
import React from 'react';

import StageContainer from './StageContainer';

const LoaderStage: React.FC = ({ children }) => (
  <StageContainer>
    <Box mt={8}>
      <Spinner />
    </Box>

    {!!children && <Box mb={16}>{children}</Box>}
  </StageContainer>
);

export default LoaderStage;
