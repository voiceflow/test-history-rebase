import { FlexCenter, Spinner } from '@voiceflow/ui';
import React from 'react';

const LoaderStage: React.FC = () => (
  <FlexCenter fullWidth style={{ height: '264px', alignItems: 'center' }}>
    <Spinner borderLess />
  </FlexCenter>
);

export default LoaderStage;
