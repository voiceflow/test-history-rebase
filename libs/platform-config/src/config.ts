import { Utils } from '@voiceflow/common';

import * as Configs from '@/configs';

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
      if (!isSupported(platform)) return defaultValue;

      return configMap[platform] ?? defaultValue;
    };
  };

export const isSupportedTypeFactory =
  <ConfigMap extends Record<string, any>>(typesConfigMap: ConfigMap) =>
  (type: unknown): type is keyof ConfigMap =>
    typeof type === 'string' && Utils.object.hasProperty(typesConfigMap, type);

export const getTypeFactory =
  <Config>() =>
  <ConfigMap extends Record<string, { types: Record<string, any> }>>(configMap: ConfigMap, defaultValue: Config) => {
    const isSupported = isSupportedFactory(configMap);

    return ({ type, platform }: { type: unknown; platform: unknown }): Config => {
      if (!isSupported(platform)) return defaultValue;
      if (!isSupportedTypeFactory(configMap[platform].types)(type)) return defaultValue;

      return configMap[platform].types[type] ?? defaultValue;
    };
  };

const LIST = [
  Configs.Alexa.CONFIG,
  Configs.Google.CONFIG,
  Configs.DialogflowES.CONFIG,
  Configs.DialogflowCX.CONFIG,
  Configs.Voiceflow.CONFIG,
  Configs.Webchat.CONFIG,
  Configs.Whatsapp.CONFIG,
  Configs.SMS.CONFIG,
  Configs.MicrosoftTeams.CONFIG,
  Configs.SMS.CONFIG,
];

const TYPE_CONFIG_MAP = buildTypeConfigMapFactory<Configs.Base.Config>()(LIST);

export const get = getFactory<Configs.Base.Config>()(TYPE_CONFIG_MAP, Configs.Base.CONFIG);

export const isSupported = isSupportedFactory(TYPE_CONFIG_MAP);

export const getTypeConfig = getTypeFactory<Configs.Base.Type.Config>()(TYPE_CONFIG_MAP, Configs.Base.Type.CONFIG);
