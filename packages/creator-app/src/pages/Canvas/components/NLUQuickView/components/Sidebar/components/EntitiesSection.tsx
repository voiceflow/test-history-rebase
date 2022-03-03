import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';

import { SectionProps } from './types';

const VariablesSection: React.FC<SectionProps> = ({ setActiveTab, activeTab }) => {
  return (
    <Section
      onClick={() => setActiveTab(InteractionModelTabType.SLOTS)}
      header="Entities"
      forceToggleChange={activeTab !== InteractionModelTabType.SLOTS}
      headerToggle
      collapseVariant={SectionToggleVariant.ARROW}
    ></Section>
  );
};

export default VariablesSection;
