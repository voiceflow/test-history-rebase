import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import styled from 'styled-components';

import { uiProjectDir } from '@/config';

const SectionContainer = styled.div`
  border: 1px solid #dedede;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 16px;
  flex-wrap: nowrap;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  color: #dedede;
  font-size: 2em;

  a {
    margin-left: 0.5em;
  }
`;

interface SectionProps {
  title: string;
  path: string;
}

const Section: React.FC<SectionProps> = ({ title, path, children }) => (
  <div>
    <SectionTitle>
      {title}
      <a href={`${uiProjectDir}/${path}`}>
        <SvgIcon icon="link" />
      </a>
    </SectionTitle>
    <SectionContainer>{children}</SectionContainer>
  </div>
);

export default Section;
