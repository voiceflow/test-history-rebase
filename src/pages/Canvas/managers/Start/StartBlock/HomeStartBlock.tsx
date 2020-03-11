import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import NewBlock, { SectionItemProps } from '@/pages/Canvas/components/Block/NewBlock';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import CommandStep from '@/pages/Canvas/managers/Command/CommandStep';

import { BaseStartBlockProps } from './types';

const HomeStartBlock: React.FC<BaseStartBlockProps> = ({ isActive, platform, invocationName, ...props }) => {
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
    <NewBlock name="Home" icon="home" isActive={isActive} sections={sections}>
      <Step>
        <Section>
          <Item
            icon="addTeammate"
            iconColor="#5589eb"
            label={platform === PlatformType.ALEXA ? `Alexa, open ${invocationName}` : `Hey Google, start ${invocationName}`}
            labelVariant={StepLabelVariant.PRIMARY}
          />
        </Section>
      </Step>
    </NewBlock>
  );
};

export default HomeStartBlock;
