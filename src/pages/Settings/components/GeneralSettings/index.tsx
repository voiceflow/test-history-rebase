import React from 'react';
import { useSelector } from 'react-redux';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { PLATFORM_SETTINGS_META, SettingSections } from '@/pages/Settings/constants';

import { Basic, Canvas, DangerZone, GlobalConversationLogic } from './Sections';

const SectionComponents: Record<SettingSections, React.FC<{ platform: PlatformType; title: SettingSections; platformMeta: any }>> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_CONVERSATION_LOGIC]: GlobalConversationLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
};

const SettingsContent: React.FC = () => {
  const platform = useSelector(Skill.activePlatformSelector);
  const { sections } = PLATFORM_SETTINGS_META[platform];

  return (
    <>
      {sections.map((section: SettingSections, index) => {
        const SectionComponent = SectionComponents[section];
        const variant = section === SettingSections.DANGER_ZONE ? SectionVariants.SECONDARY : SectionVariants.PRIMARY;

        return (
          <SettingsSection variant={variant} key={index} title={section}>
            <SectionComponent platform={platform} title={section} key={index} platformMeta={PLATFORM_SETTINGS_META[platform]} />
          </SettingsSection>
        );
      })}
    </>
  );
};

export default SettingsContent;
