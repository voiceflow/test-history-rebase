import { FlexCenter } from '@voiceflow/ui';
import React from 'react';

import { Spinner } from '@/components/legacy/Spinner';

const LoaderStage: React.FC = () => (
  <FlexCenter fullWidth style={{ height: '264px', alignItems: 'center' }}>
    <Spinner borderLess />
  </FlexCenter>
);

export default LoaderStage;
