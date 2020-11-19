import React from 'react';

import { PlatformType } from '@/constants';
import AlexaFeatures from '@/pages/Settings/components/SettingsContent/Sections/ChannelSpecificFeatures';
import { ContentSection } from '@/pages/Settings/components/SettingsContent/components';
import { SectionVariants } from '@/pages/Settings/components/constants';
import { PLATFORM_SETTINGS_META, SettingSections, SettingsTabsType } from '@/pages/Settings/constants';

import ProjectVersions from '../ProjectVersions';
import { Basic, Canvas, DangerZone, GlobalConversationLogic } from './Sections';

const SectionComponents: Record<SettingSections, React.FC<{ platform: PlatformType; title: string; platformMeta: any }>> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_CONVERSATION_LOGIC]: GlobalConversationLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
};

type SettingsContentType = {
  platform: PlatformType;
  selectedTab: SettingsTabsType;
};

const SettingsContent: React.FC<SettingsContentType> = ({ platform, selectedTab }) => {
  const sections = PLATFORM_SETTINGS_META[platform].sections;

  return selectedTab === SettingsTabsType.GENERAL ? (
    <>
      {sections.map((section: SettingSections, index) => {
        const SectionComponent = SectionComponents[section];
        const variant = section === SettingSections.DANGER_ZONE ? SectionVariants.SECONDARY : SectionVariants.PRIMARY;

        return (
          <ContentSection variant={variant} key={index} title={section}>
            <SectionComponent platform={platform} title={section} key={index} platformMeta={PLATFORM_SETTINGS_META[platform]} />
          </ContentSection>
        );
      })}
    </>
  ) : (
    <ProjectVersions />
  );
};

export default SettingsContent;
