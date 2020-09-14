import React from 'react';

import SectionBox from '@/pages/SettingsV2/components/SectionBox';
import { SectionVariants } from '@/pages/SettingsV2/components/constants';

import { ContentSectionContainer, SectionTitle } from './components';

const ContentSection: React.FC<{ title: string; variant?: SectionVariants }> = ({ title, variant, children }) => {
  return (
    <ContentSectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <SectionBox variant={variant} style={{ padding: '7px 0' }}>
        {children}
      </SectionBox>
    </ContentSectionContainer>
  );
};

export default ContentSection;
