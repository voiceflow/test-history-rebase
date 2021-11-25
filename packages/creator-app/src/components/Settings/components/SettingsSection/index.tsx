import React from 'react';

import { SectionVariants } from '@/components/Settings/constants';

import SectionBox from '../SectionBox';
import { SectionTitle, SettingsSectionContainer } from './components';

const SettingsSection: React.FC<{ title?: string; variant?: SectionVariants; noContentPadding?: boolean }> = ({
  title,
  variant,
  noContentPadding = false,
  children,
}) => (
  <SettingsSectionContainer>
    <SectionTitle>{title}</SectionTitle>
    <SectionBox variant={variant} noContentPadding={noContentPadding}>
      {children}
    </SectionBox>
  </SettingsSectionContainer>
);

export default SettingsSection;
