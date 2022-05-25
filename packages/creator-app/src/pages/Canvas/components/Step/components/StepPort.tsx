import React from 'react';

import Port from '@/pages/Canvas/components/Port';
import { PortEntityProvider } from '@/pages/Canvas/contexts';

import { StepAPIContext } from '../contexts';

interface StepPortProps {
  portID?: string | null;
}

const StepPort: React.FC<StepPortProps> = ({ portID }) => {
  const stepAPI = React.useContext(StepAPIContext);

  if (!stepAPI?.withPorts || !portID) return null;

  return (
    <PortEntityProvider id={portID}>
      <Port />
    </PortEntityProvider>
  );
};

export default StepPort;
