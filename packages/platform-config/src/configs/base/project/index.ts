import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BuiltInVariable } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

import * as InvocationName from './invocationName';
import * as Locale from './locale';
import * as Voice from './voice';

export * as InvocationName from './invocationName';
export * as Locale from './locale';
export * as Voice from './voice';

export interface Config {
  /**
   * @example 'Skill' | 'Assistant'
   */
  name: string;

  voice: null | Voice.Config;

  locale: null | Locale.Config;

  invocationName: null | InvocationName.Config;

  globalVariables: BuiltInVariable[];
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Assistant',

  voice: null,

  locale: null,

  invocationName: null,

  globalVariables: [
    BuiltInVariable.SESSIONS,
    BuiltInVariable.USER_ID,
    BuiltInVariable.TIMESTAMP,
    BuiltInVariable.PLATFORM,
    BuiltInVariable.LOCALE,
    BuiltInVariable.INTENT_CONFIDENCE,
  ],
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
