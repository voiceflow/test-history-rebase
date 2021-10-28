import { Alert, AlertVariant } from '@voiceflow/ui';
import React from 'react';

import StageContainer from './StageContainer';

const StageAlert: React.FC = ({ children }) => {
  return (
    <StageContainer>
      <Alert variant={AlertVariant.UNSTYLED} mb={0} mt={4}>
        {children}
      </Alert>
    </StageContainer>
  );
};

export default StageAlert;
