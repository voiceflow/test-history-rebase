import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { SystemVariable } from '@voiceflow/dtos';
import React from 'react';

import * as Chat from './chat';
import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Voice from './voice';

export { Chat, InvocationName, Locale, Voice };

export interface Config {
  /**
   * @example 'Skill' | 'Assistant'
   */
  name: string;

  chat: Chat.Config;

  voice: Voice.Config;

  locale: Locale.Config;

  description: React.ReactNode;

  invocationName: null | InvocationName.Config;

  globalVariables: SystemVariable[];

  noReply: boolean;
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Agent',

  chat: Chat.CONFIG,

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  description: 'Your agent name is the name of the project that you will see on your workspace dashboard.',

  invocationName: null,

  globalVariables: [
    SystemVariable.SESSIONS,
    SystemVariable.USER_ID,
    SystemVariable.TIMESTAMP,
    SystemVariable.PLATFORM,
    SystemVariable.LOCALE,
    SystemVariable.INTENT_CONFIDENCE,
    SystemVariable.LAST_RESPONSE,
    SystemVariable.LAST_EVENT,
    SystemVariable.LAST_UTTERANCE,
  ],

  noReply: true,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
