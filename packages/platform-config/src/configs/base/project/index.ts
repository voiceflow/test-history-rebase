import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { BuiltInVariable } from '@platform-config/constants';
import { Types } from '@platform-config/utils';

import * as InvocationName from './invocationName';
import * as Locale from './locale';
import * as Voice from './voice';

export { InvocationName, Locale, Voice };

export interface Config {
  /**
   * @example 'Skill' | 'Assistant'
   */
  name: string;

  voice: Voice.Config;

  locale: Locale.Config;

  invocationName: null | InvocationName.Config;

  globalVariables: BuiltInVariable[];
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Assistant',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

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
