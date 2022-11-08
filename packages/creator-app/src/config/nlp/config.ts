import * as Platform from '@voiceflow/platform-config';

import * as Configs from './configs';

const LIST: [Configs.Base.Config, ...Configs.Base.Config[]] = [
  Configs.Luis.CONFIG,
  Configs.Rasa2.CONFIG,
  Configs.Rasa3.CONFIG,
  Configs.Alexa.CONFIG,
  Configs.LexV1.CONFIG,
  Configs.Watson.CONFIG,
  Configs.Einstein.CONFIG,
  Configs.NuanceMix.CONFIG,
  Configs.Voiceflow.CONFIG,
  Configs.DialogflowCX.CONFIG,
  Configs.DialogflowES.CONFIG,
];

const TYPE_CONFIG_MAP = Platform.Config.buildTypeConfigMapFactory<Configs.Base.Config>()(LIST);

export const get = Platform.Config.getFactory<Configs.Base.Config>()(TYPE_CONFIG_MAP, Configs.Base.CONFIG);

export const getAll = () => LIST;

export const isSupported = Platform.Config.isSupportedFactory(TYPE_CONFIG_MAP);
