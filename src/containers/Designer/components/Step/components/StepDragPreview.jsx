import React from 'react';

import StepCard from './StepCard';
import StepTitle from './StepTitle';

const StepDragPreview = ({ title, children, getRect }) => (
  <div style={{ width: `${getRect().width}px` }}>
    <StepCard isPreview>
      <StepTitle>{title}</StepTitle>
      {children}
    </StepCard>
  </div>
);

export default StepDragPreview;
