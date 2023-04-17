import { AlexaConstants } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as VersionV2 from '@/ducks/versionV2';
import { useFeature, useSelector } from '@/hooks';

import { Events, GadgetsToggle, ModelSensitivity } from './components';

const MODEL_SENSITIVITY_SUPPORTED_LOCALES = new Set<string>([
  AlexaConstants.Locale.EN_US,
  AlexaConstants.Locale.EN_AU,
  AlexaConstants.Locale.EN_CA,
  AlexaConstants.Locale.EN_IN,
  AlexaConstants.Locale.EN_GB,
  AlexaConstants.Locale.DE_DE,
]);

const AlexaFeatures: React.FC = () => {
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);
  const locales = useSelector(VersionV2.active.localesSelector);

  const modelSensitivityShown = React.useMemo(() => locales.some((locale: string) => MODEL_SENSITIVITY_SUPPORTED_LOCALES.has(locale)), [locales]);

  return (
    <Settings.Section title="Channel Specific Features">
      <Settings.Card>
        {modelSensitivityShown && (
          <>
            <ModelSensitivity />

            <SectionV2.Divider inset />
          </>
        )}

        {gadgets.isEnabled && (
          <>
            <GadgetsToggle />
            <SectionV2.Divider inset />
          </>
        )}

        <Events />
      </Settings.Card>
    </Settings.Section>
  );
};

export default AlexaFeatures;
