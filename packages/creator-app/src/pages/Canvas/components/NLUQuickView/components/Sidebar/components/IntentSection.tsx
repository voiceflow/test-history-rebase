import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';

import { SectionProps } from './types';

const IntentSection: React.FC<SectionProps> = ({ setActiveTab, activeTab }) => {
  return (
    <Section
      onClick={() => setActiveTab(InteractionModelTabType.INTENTS)}
      header="Intents"
      forceToggleChange={activeTab !== InteractionModelTabType.INTENTS}
      headerToggle
      collapseVariant={SectionToggleVariant.ARROW}
    ></Section>
  );
};

export default IntentSection;
