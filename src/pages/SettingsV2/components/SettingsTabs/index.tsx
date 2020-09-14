import React from 'react';

import StickyContainer from '@/components/StickyContainer';
import { PlatformType } from '@/constants';
import { PLATFORM_SETTINGS_META, SettingsTabsType } from '@/pages/SettingsV2/constants';
import { FadeLeftContainer } from '@/styles/animations';

import SectionBox from '../SectionBox';
import { SettingsTab } from './components';

type SettingsTabsProps = {
  selectedTab: SettingsTabsType;
  platform: PlatformType;
  setSelectedTab: (tab: SettingsTabsType) => void;
};
const SettingsTabs: React.FC<SettingsTabsProps> = ({ selectedTab, setSelectedTab, platform }) => {
  const settingsTabs = PLATFORM_SETTINGS_META[platform].tabs;
  return (
    <StickyContainer top={144} width={200}>
      <FadeLeftContainer>
        <SectionBox>
          {settingsTabs.map((tab, index) => {
            return (
              <SettingsTab key={index} selected={tab === selectedTab} onClick={() => setSelectedTab(tab)}>
                {tab}
              </SettingsTab>
            );
          })}
        </SectionBox>
      </FadeLeftContainer>
    </StickyContainer>
  );
};

export default SettingsTabs;
