import { Constants } from '@voiceflow/alexa-types';
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
  Constants.Locale.EN_US,
  Constants.Locale.EN_AU,
  Constants.Locale.EN_CA,
  Constants.Locale.EN_IN,
  Constants.Locale.EN_GB,
  Constants.Locale.DE_DE,
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
