import { Box } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSetup, useTrackingEvents } from '@/hooks';
import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { DEFAULT_MAX_WIDTH, getSettingsMetaProps, SettingSections } from '@/pages/Settings/constants';

import { Basic, Canvas, DangerZone, DialogflowConsole, GlobalConversationLogic, TestTool } from './Sections';

const SectionComponents: Record<
  SettingSections,
  React.FC<{ platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType; title: SettingSections; platformMeta: any }>
> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_CONVERSATION_LOGIC]: GlobalConversationLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
  [SettingSections.DIALOGFLOW_CONSOLE]: DialogflowConsole,
  [SettingSections.TEST_TOOL]: TestTool,
};

const SettingsContent: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.typeV2Selector);
  const platformMeta = getSettingsMetaProps(platform, projectType);
  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectSettingsOpened();
  });
  return (
    <Box maxWidth={DEFAULT_MAX_WIDTH}>
      {platformMeta.sections.map((section: SettingSections, index) => {
        const SectionComponent = SectionComponents[section];
        const variant = section === SettingSections.DANGER_ZONE ? SectionVariants.SECONDARY : SectionVariants.PRIMARY;

        return (
          <SettingsSection variant={variant} key={index} title={section}>
            <SectionComponent platform={platform} projectType={projectType} title={section} key={index} platformMeta={platformMeta} />
          </SettingsSection>
        );
      })}
    </Box>
  );
};

export default SettingsContent;
