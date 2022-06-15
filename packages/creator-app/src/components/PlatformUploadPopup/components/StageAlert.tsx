import { Alert } from '@voiceflow/ui';
import React from 'react';

import StageContainer from './StageContainer';

const StageAlert: React.FC = ({ children }) => (
  <StageContainer>
    <Alert variant={Alert.Variant.UNSTYLED} mb={0} mt={4}>
      {children}
    </Alert>
  </StageContainer>
);

export default StageAlert;
