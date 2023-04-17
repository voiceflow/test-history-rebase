import * as Platform from '@voiceflow/platform-config';

import * as Configs from './configs';

const TYPE_CONFIG_MAP = Platform.Config.buildTypeConfigMapFactory<Configs.Base.Config>()([
  Configs.Lex.CONFIG,
  Configs.Luis.CONFIG,
  Configs.Rasa.CONFIG,
  Configs.Alexa.CONFIG,
  Configs.Watson.CONFIG,
  Configs.Google.CONFIG,
  Configs.Einstein.CONFIG,
  Configs.NuanceMix.CONFIG,
  Configs.Voiceflow.CONFIG,
  Configs.DialogflowCX.CONFIG,
  Configs.DialogflowES.CONFIG,
]);

export const get = Platform.Config.getFactory<Configs.Base.Config>()(TYPE_CONFIG_MAP, Configs.Base.CONFIG);

export const isSupported = Platform.Config.isSupportedFactory(TYPE_CONFIG_MAP);
