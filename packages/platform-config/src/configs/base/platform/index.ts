import { Extendable as ExtendableValue, Merge } from '@platform-config/configs/types';
import { NLUType, PlatformType, ProjectType } from '@platform-config/constants';
import { TypeGuards, Types } from '@platform-config/utils';
import { EmptyObject } from '@voiceflow/common';

import * as Type from '../type';

export interface Config {
  is: (platform?: unknown) => boolean;

  type: PlatformType;

  name: string;

  types: {
    [Key in ProjectType]?: Type.Config & { type: Key };
  };

  /**
   * list of NLUs that platform supports, most of the platforms supports 1 nlu
   * but some platforms like voiceflow supports multiple nlu
   * first value is used a default value in project creation modal
   */
  supportedNLUs: [NLUType, ...NLUType[]];

  oneClickPublish: boolean;
}

export type Extendable<Config> = ExtendableValue<Omit<Config, 'types'>> & {
  types: {
    [Key in ProjectType]?: ExtendableValue<Type.Config & { type: Key }>;
  };
};

export const CONFIG = Types.satisfies<Config>()({
  is: TypeGuards.isValueFactory(PlatformType.VOICEFLOW),

  type: PlatformType.VOICEFLOW,

  name: 'Voiceflow',

  types: {},

  supportedNLUs: [NLUType.VOICEFLOW],

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
