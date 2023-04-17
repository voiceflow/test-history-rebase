import * as Platform from '@voiceflow/platform-config';

import * as Configs from './configs';

const TYPE_CONFIG_MAP = Platform.Config.buildTypeConfigMapFactory<Configs.Base.Config>()([Configs.Twilio.CONFIG, Configs.Facebook.CONFIG]);

export const get = Platform.Config.getFactory<Configs.Base.Config>()(TYPE_CONFIG_MAP, Configs.Base.CONFIG);

export const isSupported = Platform.Config.isSupportedFactory(TYPE_CONFIG_MAP);
