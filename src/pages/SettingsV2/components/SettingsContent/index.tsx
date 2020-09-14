import React from 'react';

import { PlatformType } from '@/constants';
import { ContentSection } from '@/pages/SettingsV2/components/SettingsContent/components';
import { SectionVariants } from '@/pages/SettingsV2/components/constants';
import { PLATFORM_SETTINGS_META, SectionComponents, SettingSections, SettingsTabsType } from '@/pages/SettingsV2/constants';

import ProjectVersions from '../ProjectVersions';

type SettingsContentType = {
  platform: PlatformType;
  selectedTab: SettingsTabsType;
};

const SettingsContent: React.FC<SettingsContentType> = ({ platform, selectedTab }) => {
  const sections = PLATFORM_SETTINGS_META[platform].sections;

  return selectedTab === SettingsTabsType.GENERAL ? (
    <>
      {sections.map((section: SettingSections, index) => {
        const SectionComponent: React.FC<any> = SectionComponents[section];
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
