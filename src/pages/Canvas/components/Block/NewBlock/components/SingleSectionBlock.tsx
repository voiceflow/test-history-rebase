import React from 'react';

import { SectionProps } from '../types';
import Section from './NewBlockSection';

export type SingleSectionBlockProps = SectionProps;

const SingleSectionBlock: React.FC<SingleSectionBlockProps> = ({ state, variant, name, icon, children }) => (
  <Section state={state} variant={variant} name={name} icon={icon}>
    {children}
  </Section>
);

export default SingleSectionBlock;
