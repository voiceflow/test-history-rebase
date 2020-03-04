import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';

import Section, { NewBlockSectionProps } from './NewBlockSection';

export type MultiSectionBlockProps = {
  sections: React.PropsWithChildren<WithOptional<NewBlockSectionProps, 'state' | 'variant'>>[];
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
