import { Box, useSetup } from '@voiceflow/ui';
import React from 'react';

import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import { useAlexaProjectSettings } from '@/hooks/project';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { DEFAULT_MAX_WIDTH, getSettingsMetaProps, SettingSections } from '@/pages/Settings/constants';

import { SectionComponents, SectionFeatureFlags } from './constants';

const SettingsContent: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const platformMeta = getSettingsMetaProps(platform, projectType);
  const [trackingEvents] = useTrackingEvents();
  const featureFlags = useSelector(Feature.allActiveFeaturesSelector);

  useSetup(() => {
    trackingEvents.trackActiveProjectSettingsOpened();
  });

  const canUseAlexaSettings = useAlexaProjectSettings();

  return (
    <Box maxWidth={DEFAULT_MAX_WIDTH}>
      {platformMeta.sections.map((section: SettingSections, index): null | React.ReactElement => {
        const SectionComponent = SectionComponents[section];
        const sectionFeatureFlag = SectionFeatureFlags[section];

        if (sectionFeatureFlag && !featureFlags[sectionFeatureFlag]?.isEnabled) return null;
        if (section === SettingSections.CHANNEL_SPECIFIC_FEATURES && !canUseAlexaSettings) return null;

        return <SectionComponent platform={platform} projectType={projectType} title={section} key={index} platformMeta={platformMeta} />;
      })}
    </Box>
  );
};

export default SettingsContent;
