import { FlexCenter, Spinner } from '@voiceflow/ui';
import React from 'react';

const ProjectStateLoading: React.FC = () => {
  return (
    <FlexCenter fullWidth style={{ height: '264px', alignItems: 'center' }}>
      <Spinner borderLess />
    </FlexCenter>
  );
};

export default ProjectStateLoading;
