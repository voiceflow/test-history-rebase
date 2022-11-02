import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { useSelector } from 'react-redux';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAlexaProjectSettings, useFeature, useSetup, useTrackingEvents } from '@/hooks';
import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { DEFAULT_MAX_WIDTH, getSettingsMetaProps, SettingSections } from '@/pages/Settings/constants';

import { Basic, Canvas, DangerZone, DialogflowConsole, GlobalConversationLogic, GlobalLogic, TestTool } from './Sections';

const SectionComponents: Record<
  SettingSections,
  React.FC<{ platform: VoiceflowConstants.PlatformType; projectType: VoiceflowConstants.ProjectType; title: SettingSections; platformMeta: any }>
> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_CONVERSATION_LOGIC]: GlobalConversationLogic,
  [SettingSections.GLOBAL_LOGIC]: GlobalLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
  [SettingSections.DIALOGFLOW_CONSOLE]: DialogflowConsole,
  [SettingSections.TEST_TOOL]: TestTool,
};

const SettingsContent: React.FC = () => {
  const globalNoMatchNoReply = useFeature(Realtime.FeatureFlag.GLOABL_NO_MATCH_NO_REPLY);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const platformMeta = getSettingsMetaProps(platform, projectType);
  const [trackingEvents] = useTrackingEvents();

  useSetup(() => {
    trackingEvents.trackActiveProjectSettingsOpened();
  });

  const canUseAlexaSettings = useAlexaProjectSettings();
  return (
    <Box maxWidth={DEFAULT_MAX_WIDTH}>
      {platformMeta.sections.map((section: SettingSections, index): null | React.ReactElement => {
        const SectionComponent = SectionComponents[section];
        const variant = section === SettingSections.DANGER_ZONE ? SectionVariants.SECONDARY : SectionVariants.PRIMARY;

        if ((section === SettingSections.CHANNEL_SPECIFIC_FEATURES || section === SettingSections.TEST_TOOL) && !canUseAlexaSettings) return null;
        if (section === SettingSections.GLOBAL_LOGIC && !globalNoMatchNoReply.isEnabled) return null;

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
