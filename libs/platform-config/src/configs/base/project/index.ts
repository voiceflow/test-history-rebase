import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
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

  globalVariables: VoiceflowConstants.BuiltInVariable[];

  noReply: boolean;
}

export const CONFIG = Types.satisfies<Config>()({
  name: 'Assistant',

  chat: Chat.CONFIG,

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  description: 'Your assitant name is the name of the project that you will see on your workspace dashboard.',

  invocationName: null,

  globalVariables: [
    VoiceflowConstants.BuiltInVariable.SESSIONS,
    VoiceflowConstants.BuiltInVariable.USER_ID,
    VoiceflowConstants.BuiltInVariable.TIMESTAMP,
    VoiceflowConstants.BuiltInVariable.PLATFORM,
    VoiceflowConstants.BuiltInVariable.LOCALE,
    VoiceflowConstants.BuiltInVariable.INTENT_CONFIDENCE,
    VoiceflowConstants.BuiltInVariable.LAST_RESPONSE,
    VoiceflowConstants.BuiltInVariable.LAST_UTTERANCE,
  ],

  noReply: true,
});

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
