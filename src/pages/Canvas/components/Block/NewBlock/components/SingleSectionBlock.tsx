import React from 'react';

import Section, { NewBlockSectionProps } from './NewBlockSection';

export type SingleSectionBlockProps = NewBlockSectionProps;

const SingleSectionBlock: React.FC<NewBlockSectionProps> = ({ state, variant, name, icon, children }) => (
  <Section state={state} variant={variant} name={name} icon={icon}>
    {children}
  </Section>
);

export default SingleSectionBlock;
