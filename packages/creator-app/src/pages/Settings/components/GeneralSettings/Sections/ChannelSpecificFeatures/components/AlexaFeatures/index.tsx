import { AlexaConstants } from '@voiceflow/alexa-types';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { Events, GadgetsToggle, ModelSensitivity } from './components';

export interface AlexaFeaturesOwnProps {
  platformMeta: PlatformSettingsMetaProps;
}

const MODEL_SENSITIVITY_SUPPORTED_LOCALES = new Set<string>([
  AlexaConstants.Locale.EN_US,
  AlexaConstants.Locale.EN_AU,
  AlexaConstants.Locale.EN_CA,
  AlexaConstants.Locale.EN_IN,
  AlexaConstants.Locale.EN_GB,
  AlexaConstants.Locale.DE_DE,
]);

const AlexaFeatures: React.FC<AlexaFeaturesOwnProps> = ({ platformMeta }) => {
  const locales = useSelector(VersionV2.active.localesSelector);
  const modelSensitivityShown = React.useMemo(() => locales.some((locale) => MODEL_SENSITIVITY_SUPPORTED_LOCALES.has(locale)), [locales]);

  return (
    <>
      {modelSensitivityShown && <ModelSensitivity platformMeta={platformMeta} />}

      <GadgetsToggle modelSensitivityShown={modelSensitivityShown} />

      <Events modelSensitivityShown={modelSensitivityShown} platformMeta={platformMeta} />
    </>
  );
};

export default AlexaFeatures;
