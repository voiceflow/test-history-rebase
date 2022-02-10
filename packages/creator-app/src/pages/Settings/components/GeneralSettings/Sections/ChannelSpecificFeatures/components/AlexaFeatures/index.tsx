import { AlexaConstants } from '@voiceflow/alexa-types';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import { Events, GadgetsToggle, ModelSensitivity } from './components';

export interface AlexaFeaturesOwnProps {
  platformMeta: PlatformSettingsMetaProps;
}

const MODEL_SENSITIVITY_SUPPORTED_LOCALES: string[] = [
  AlexaConstants.Locale.EN_US,
  AlexaConstants.Locale.EN_AU,
  AlexaConstants.Locale.EN_CA,
  AlexaConstants.Locale.EN_IN,
  AlexaConstants.Locale.EN_GB,
  AlexaConstants.Locale.DE_DE,
];

const AlexaFeatures: React.FC<ConnectedAlexaFeaturesProps & AlexaFeaturesOwnProps> = ({ locales, platformMeta }) => {
  const modelSensitivityShown = React.useMemo(() => locales.some((locale) => MODEL_SENSITIVITY_SUPPORTED_LOCALES.includes(locale)), [locales]);

  return (
    <>
      {modelSensitivityShown && <ModelSensitivity platformMeta={platformMeta} />}

      <GadgetsToggle modelSensitivityShown={modelSensitivityShown} />

      <Events modelSensitivityShown={modelSensitivityShown} platformMeta={platformMeta} />
    </>
  );
};

const mapStateToProps = {
  locales: VersionV2.active.alexa.localesSelector,
};

type ConnectedAlexaFeaturesProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(AlexaFeatures) as React.FC<AlexaFeaturesOwnProps>;
