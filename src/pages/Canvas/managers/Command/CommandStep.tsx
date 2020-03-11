/* eslint-disable no-shadow */
import React from 'react';

import Step, { BaseStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type Command = {
  name: string;
  flowID: string;
};

export type CommandStepProps = Command &
  Omit<BaseStepProps, 'icon'> & {
    onCommandClick: (id: string) => void;
  };

const CommandStep: React.FC<CommandStepProps> = ({ name, isActive, onClick, flowID, onCommandClick }) => {
  const onClickFlow = React.useCallback(() => onCommandClick(flowID), [onCommandClick, flowID]);

  return (
    <Step isActive={isActive} onClick={onClick}>
      <Section>
        <Item icon="flow" iconColor="#3c6997" label={name} onClick={onClickFlow} />
      </Section>
    </Step>
  );
};

export default CommandStep;
