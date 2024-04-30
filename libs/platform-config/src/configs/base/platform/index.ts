import type { EmptyObject } from '@voiceflow/common';

import type { Extendable as ExtendableValue, Merge } from '@/configs/types';
import type { ProjectType } from '@/constants';
import { NLUType, PlatformType } from '@/constants';
import { TypeGuards, Types } from '@/utils';

import type * as Type from '../type';
import * as Components from './components';
import * as Context from './context';
import * as Integration from './integration';

export { Components, Context, Integration };

export interface Config {
  is: (platform?: unknown) => boolean;

  type: PlatformType;

  name: string;

  /**
   * platform specific project types configs
   */
  types: {
    [Key in ProjectType]?: Type.Config & { type: Key };
  };

  /**
   * platform specific context, project-type specific context is defined in project config
   * use this to inject any platform specific dependencies, that can't be used in project-config package
   */
  Context: typeof Context.Context;

  /**
   * platform specific components,
   * project-type specific components are defined in project config
   */
  components: Components.Config;

  /**
   * platform integration config
   */
  integration: Integration.Config;

  /**
   * list of NLUs that platform supports, most of the platforms supports 1 nlu
   * but some platforms like voiceflow supports multiple nlu
   * first value is used as default value in project creation modal
   */
  supportedNLUs: [NLUType, ...NLUType[]];

  /**
   * if platform supports publishing, most platforms support it
   * voiceflow platform doesn't support publishing
   */
  oneClickPublish: boolean;

  /**
   * if platform is based on the voiceflow platform
   */
  isVoiceflowBased: boolean;

  /**
   * if platform integration supports uploading NLU or other data
   * true for alexa, google, dialogflow es/cx
   */
  withThirdPartyUpload: boolean;

  /**
   * if platform is being deprecated and will be removed soon
   */
  isDeprecated: boolean;
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

  Context: Context.Context,

  components: Components.CONFIG,

  integration: Integration.CONFIG,

  supportedNLUs: [NLUType.VOICEFLOW],

  oneClickPublish: false,

  isVoiceflowBased: false,

  withThirdPartyUpload: false,

  isDeprecated: false,
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
