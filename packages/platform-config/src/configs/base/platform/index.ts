import { Extendable as ExtendableValue, Merge } from '@platform-config/configs/types';
import { PlatformType, ProjectType } from '@platform-config/constants';
import { Types } from '@platform-config/utils';
import { EmptyObject } from '@voiceflow/common';

import * as Type from '../type';

export interface Config {
  type: PlatformType;

  name: string;

  types: {
    [Key in ProjectType]?: Type.Config & { type: Key };
  };

  oneClickPublish: boolean;
}

export type Extendable<Config> = ExtendableValue<
  Omit<Config, 'types'> & {
    types: {
      [Key in ProjectType]: Type.Config & { type: Key };
    };
  }
>;

export const CONFIG = Types.satisfies<Config>()({
  type: PlatformType.VOICEFLOW,

  name: 'Voiceflow',

  types: {},

  oneClickPublish: false,
});

export const extendFactory =
  <Config extends EmptyObject>(baseConfig: Config) =>
  <ExtendedConfig extends Extendable<Config>>(extendedConfig: ExtendedConfig): Merge<Config, ExtendedConfig> => ({
    ...baseConfig,
    ...extendedConfig,
  });

export const infersFactory =
  <Config extends EmptyObject>() =>
  <ExtendedConfig extends Extendable<Config>>(extendedConfig: ExtendedConfig): Config =>
    extendedConfig as unknown as Config;

export const infer = infersFactory<Config>();
export const extend = extendFactory<Config>(CONFIG);
