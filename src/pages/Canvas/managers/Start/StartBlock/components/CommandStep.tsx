/* eslint-disable no-shadow */
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type Command = {
  name: string;
  portID: string;
  flowID: string;
  isActive: boolean;
};

export type CommandStepProps = Command & {
  onCommandClick: (id: string) => void;
};

const CommandStep: React.FC<CommandStepProps> = ({ name, portID, flowID, isActive, onCommandClick }) => {
  const onClick = (id: string) => () => onCommandClick(id);

  return (
    <Step isActive={isActive}>
      <Section>
        <Item icon="flow" iconColor="#3c6997" label={name} portID={portID} onClick={onClick(flowID)} />
      </Section>
    </Step>
  );
};

export default CommandStep;
