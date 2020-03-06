import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import NewBlock, { MultiSectionBlockProps, NewBlockProps, SectionsVariant } from '@/pages/Canvas/components/Block/NewBlock';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

import { CommandStep } from './components';
import { Command } from './components/CommandStep';

// defined prop types here instead of index file to avoid circular dependency
export type BaseStartBlockProps = Omit<NewBlockProps, 'sectionVariant'> & {
  platform?: PlatformType;
  invocationName?: string;
} & ({ commands?: never; onCommandClick?: never } | { commands: Command[]; onCommandClick: (id: string) => void });

const HomeStartBlock: React.FC<BaseStartBlockProps> = ({ isActive, platform, invocationName, ...props }) => {
  const sections: MultiSectionBlockProps['sections'] = [
    {
      name: 'Home',
      icon: 'home',
      children: (
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

export default HomeStartBlock;
