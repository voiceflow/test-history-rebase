import * as Platform from '@voiceflow/platform-config';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as ProjectV2 from '@/ducks/projectV2';
import { useAlexaProjectSettings, useSetup, useTrackingEvents } from '@/hooks';
import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { DEFAULT_MAX_WIDTH, getSettingsMetaProps, SettingSections } from '@/pages/Settings/constants';

import { Basic, Canvas, DangerZone, DialogflowConsole, GlobalLogic } from './Sections';

const SectionComponents: Record<
  SettingSections,
  React.FC<{ platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType; title: SettingSections; platformMeta: any }>
> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_LOGIC]: GlobalLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
  [SettingSections.DIALOGFLOW_CONSOLE]: DialogflowConsole,
};

const SettingsContent: React.FC = () => {
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

        if (section === SettingSections.CHANNEL_SPECIFIC_FEATURES && !canUseAlexaSettings) return null;

        return <SectionComponent platform={platform} projectType={projectType} title={section} key={index} platformMeta={platformMeta} />;
      })}
    </Box>
  );
};

export default SettingsContent;
