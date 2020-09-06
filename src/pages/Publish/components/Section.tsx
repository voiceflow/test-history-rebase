import React from 'react';

import { SectionBox, SectionContainer, SectionInnerContainer, SectionTitle } from '@/pages/Publish/components/index';

const Section: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <SectionContainer>
      <SectionInnerContainer>
        <SectionTitle> {title}</SectionTitle>
        <SectionBox>{children}</SectionBox>
      </SectionInnerContainer>
    </SectionContainer>
  );
};

export default Section;
