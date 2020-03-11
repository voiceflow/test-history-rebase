import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import NewBlock, { SectionItemProps } from '@/pages/Canvas/components/Block/NewBlock';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import CommandStep from '@/pages/Canvas/managers/Command/CommandStep';

import { BaseStartBlockProps } from './types';

export type FlowStartBlockProps = BaseStartBlockProps & {
  flowName: string;
};

const FlowStartBlock: React.FC<FlowStartBlockProps> = ({ isActive, flowName, ...props }) => {
  const sections: SectionItemProps[] = props.commands
    ? [
        {
          name: 'Commands',
          children: (
            <>
              {props.commands.map((command, index) => (
                <CommandStep key={index} {...command} onCommandClick={props.onCommandClick} />
              ))}
            </>
          ),
        },
      ]
    : [];

  return (
    <NewBlock name={flowName} isActive={isActive} sections={sections}>
      <Step>
        <Section>
          <Item icon="inFlow" iconColor="#279745" label="Conversation continues here" labelVariant={StepLabelVariant.SECONDARY} />
        </Section>
      </Step>
    </NewBlock>
  );
};

export default FlowStartBlock;
