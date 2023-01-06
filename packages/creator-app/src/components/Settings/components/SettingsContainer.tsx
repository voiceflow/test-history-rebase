import React from 'react';

import { styled } from '@/hocs/styled';
import { FadeLeftContainer } from '@/styles/animations';

import SettingsTabs, { Tab } from './SettingsTabs';

const InnerContainer = styled.div`
  padding: 35px;
  max-width: 1000px;
  margin: auto;
  display: flex;
`;

const LeftSection = styled.div`
  min-width: 200px;
  margin-right: 30px;
`;

const RightSection = styled.div`
  max-width: 700px;
  flex: 1;
`;

const SettingsContainer: React.OldFC<{ tabs: Tab[] }> = ({ tabs, children }) => (
  <InnerContainer>
    <LeftSection>
      <SettingsTabs tabs={tabs} />
    </LeftSection>
    <RightSection>
      <FadeLeftContainer>{children}</FadeLeftContainer>
    </RightSection>
  </InnerContainer>
);

export default SettingsContainer;
