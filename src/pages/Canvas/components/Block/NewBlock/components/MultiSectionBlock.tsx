import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';

import { SectionItemProps } from '../types';
import Section from './NewBlockSection';

export type MultiSectionBlockProps = {
  sections: SectionItemProps[];
};

const MultiSectionBlock: React.FC<MultiSectionBlockProps> = ({ sections }) => (
  <>
    {sections.map(({ state = BlockState.REGULAR, variant = BlockVariant.STANDARD, name, children, icon }, index) => {
      return (
        <Section key={index} state={state} variant={variant} name={name} icon={icon}>
          {children}
        </Section>
      );
    })}
  </>
);

export default MultiSectionBlock;
