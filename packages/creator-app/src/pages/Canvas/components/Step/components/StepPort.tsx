import React from 'react';

import { styled, units } from '@/hocs';
import Port from '@/pages/Canvas/components/Port';
import { PortEntityProvider } from '@/pages/Canvas/contexts';

import { StepAPIContext } from '../contexts';

const Container = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  width: 42px;
  margin: -${units(2)}px -${units(2)}px -${units(2)}px 0;
`;

interface StepPortProps {
  portID?: string | null;
  parentActionsPath?: string;
}

const StepPort: React.FC<StepPortProps> = ({ portID, parentActionsPath }) => {
  const stepAPI = React.useContext(StepAPIContext);

  if (!stepAPI?.withPorts || !portID) return null;

  return (
    <PortEntityProvider id={portID}>
      <Container>
        <Port flat parentActionsPath={parentActionsPath} />
      </Container>
    </PortEntityProvider>
  );
};

export default StepPort;
