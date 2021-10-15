import { Alert, AlertVariant } from '@voiceflow/ui';
import React from 'react';

import { StageContainer } from '@/pages/Publish/Upload/components';

const ProjectStateError: React.FC = () => {
  return (
    <StageContainer>
      <Alert variant={AlertVariant.UNSTYLED} mb={0} mt={4}>
        Failed to retrieve projects for your Google developer account
      </Alert>
    </StageContainer>
  );
};

export default ProjectStateError;
