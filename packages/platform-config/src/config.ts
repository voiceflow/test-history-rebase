import * as Configs from '@platform-config/configs';
import { Utils } from '@voiceflow/common';

type TypeConfigMap<Config, Key extends string> = { [key in Key]: Config };

export const buildTypeConfigMapFactory =
  <Config>() =>
  <T extends { type: string }>(configs: T[]): TypeConfigMap<Config, T['type']> =>
    Utils.array.createMap(configs, (config) => config.type) as unknown as TypeConfigMap<Config, T['type']>;

export const isSupportedFactory =
  <ConfigMap extends Record<string, any>>(configMap: ConfigMap) =>
  (platform: unknown): platform is keyof ConfigMap =>
    typeof platform === 'string' && Utils.object.hasProperty(configMap, platform);

export const getFactory =
  <Config>() =>
  <ConfigMap extends Record<string, any>>(configMap: ConfigMap, defaultValue: Config) => {
    const isSupported = isSupportedFactory(configMap);

    return (platform: unknown): Config => {
      if (isSupported(platform)) return configMap[platform];

      return defaultValue;
    };
  };

const LIST = [
  Configs.Alexa.CONFIG,
  Configs.Google.CONFIG,
  Configs.DialogflowES.CONFIG,
  Configs.dialogflowCX.CONFIG,
  Configs.Voiceflow.CONFIG,
  Configs.Webchat.CONFIG,
];

const TYPE_CONFIG_MAP = buildTypeConfigMapFactory<Configs.Base.Config>()(LIST);

export const get = getFactory<Configs.Base.Config>()(TYPE_CONFIG_MAP, Configs.Base.CONFIG);

export const isSupported = isSupportedFactory(TYPE_CONFIG_MAP);
