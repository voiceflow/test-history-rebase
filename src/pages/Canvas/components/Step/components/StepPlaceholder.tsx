import React from 'react';

import { BlockVariant } from '@/constants/canvas';

import Container from './StepPlaceholderContainer';
import CaptureZone from './StepReorderCaptureZone';

export type StepPlaceholderProps = {
  variant: BlockVariant;
};

const StepPlaceholder: React.FC<StepPlaceholderProps> = ({ variant }) => {
  const [forceHeight, setForceHeight] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setForceHeight(false), 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Container forceHeight={forceHeight} variant={variant}>
      <CaptureZone />
    </Container>
  );
};

export default StepPlaceholder;
