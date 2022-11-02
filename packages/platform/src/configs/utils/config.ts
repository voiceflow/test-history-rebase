import { Extendable, Merge } from '@platform/configs/types';
import { EmptyObject } from '@voiceflow/common';

export const extendFactory =
  <Config extends EmptyObject>() =>
  <BaseConfig extends EmptyObject>(baseConfig: BaseConfig) =>
  <ExtendedConfig extends Extendable<Config>>(extendedConfig: ExtendedConfig): Merge<BaseConfig, ExtendedConfig> => ({
    ...baseConfig,
    ...extendedConfig,
  });
