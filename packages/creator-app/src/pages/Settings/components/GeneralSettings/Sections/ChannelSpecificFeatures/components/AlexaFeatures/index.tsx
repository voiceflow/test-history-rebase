import { Locale } from '@voiceflow/alexa-types';
import React from 'react';

import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps } from '@/types';

import { Events, GadgetsToggle, ModelSensitivity } from './components';

export type AlexaFeaturesOwnProps = { platformMeta: PlatformSettingsMetaProps };

const MODEL_SENSITIVITY_SUPPORTED_LOCALES: string[] = [Locale.EN_US, Locale.EN_AU, Locale.EN_CA, Locale.EN_IN, Locale.EN_GB, Locale.DE_DE];

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
  locales: Version.alexa.activeLocalesSelector,
};

type ConnectedAlexaFeaturesProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps, null)(AlexaFeatures) as React.FC<AlexaFeaturesOwnProps>;
