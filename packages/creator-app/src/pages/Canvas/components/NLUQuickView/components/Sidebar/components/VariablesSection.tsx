import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';

import { SectionProps } from './types';

const VariablesSection: React.FC<SectionProps> = ({ setActiveTab, activeTab }) => {
  return (
    <Section
      onClick={() => setActiveTab(InteractionModelTabType.VARIABLES)}
      header="Variables"
      forceToggleChange={activeTab !== InteractionModelTabType.VARIABLES}
      headerToggle
      collapseVariant={SectionToggleVariant.ARROW}
    ></Section>
  );
};

export default VariablesSection;
