import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import NewBlock, { SectionItemProps, SectionsVariant } from '@/pages/Canvas/components/Block/NewBlock';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

import { BaseStartBlockProps } from './HomeStartBlock';
import { CommandStep } from './components';

export type FlowStartBlockProps = BaseStartBlockProps & {
  flowName: string;
};

const FlowStartBlock: React.FC<FlowStartBlockProps> = ({ isActive, flowName, ...props }) => {
  const sections: SectionItemProps[] = [
    {
      name: flowName,
      children: (
        <Step>
          <Section>
            <Item icon="inFlow" iconColor="#279745" label="Conversation continues here" labelVariant={StepLabelVariant.SECONDARY} />
          </Section>
        </Step>
      ),
    },
    ...(props.commands
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
      : []),
  ];

  return <NewBlock sectionsVariant={SectionsVariant.MULTI_SECTION} isActive={isActive} sections={sections} />;
};

export default FlowStartBlock;
