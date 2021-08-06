import React from 'react';

import StepStatus from '@/components/CreationSteps/components/StepStatus';

interface ProgressStatusProps {
  title: any;
  numberOfSteps: number;
  stepStack: any[];
}

const ProgressStatus: React.FC<ProgressStatusProps> = ({ title, numberOfSteps, stepStack }) => (
  <StepStatus title={title} numberOfSteps={numberOfSteps} stepStack={stepStack} />
);

export default ProgressStatus;
