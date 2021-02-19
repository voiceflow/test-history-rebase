import React from 'react';

import { SectionVariants } from '@/pages/Settings/components/constants';
import SectionBox from '@/pages/Settings/components/SectionBox';

import { ContentSectionContainer, SectionTitle } from './components';

const ContentSection: React.FC<{ title: string; variant?: SectionVariants }> = ({ title, variant, children }) => (
  <ContentSectionContainer>
    <SectionTitle>{title}</SectionTitle>
    <SectionBox variant={variant} style={{ padding: '7px 0' }}>
      {children}
    </SectionBox>
  </ContentSectionContainer>
);

export default ContentSection;
