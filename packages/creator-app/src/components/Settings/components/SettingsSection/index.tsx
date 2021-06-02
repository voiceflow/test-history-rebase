import React from 'react';

import { SectionVariants } from '@/components/Settings/constants';

import SectionBox from '../SectionBox';
import { SectionTitle, SettingsSectionContainer } from './components';

const SettingsSection: React.FC<{ title: string; variant?: SectionVariants }> = ({ title, variant, children }) => (
  <SettingsSectionContainer>
    <SectionTitle>{title}</SectionTitle>
    <SectionBox variant={variant} style={{ padding: '7px 0' }}>
      {children}
    </SectionBox>
  </SettingsSectionContainer>
);

export default SettingsSection;
