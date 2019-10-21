import React from 'react';

import StepCard from './StepCard';
import StepOverlay from './StepOverlay';

const StepContainer = ({ isDragging, className, children }, ref) => (
  <StepCard isDragging={isDragging} tabIndex={-1} fullWidth className={className} ref={ref}>
    {children}
    <StepOverlay isDragging={isDragging} />
  </StepCard>
);

export default React.forwardRef(StepContainer);
