import * as Base from '@platform-config/configs/base';
import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { ChatVersion } from '@voiceflow/chat-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Prompt from '../prompt';

const PLATFORM_ONLY_FILES = Types.satisfies<keyof ChatVersion.Settings>()(['messageDelay']);

export const smart = createSmartSimpleAdapter<Omit<ChatVersion.Settings, 'session'>, Models.Version.Settings.Model>(
  ({ error, globalNoMatch, globalNoReply, ...dbSettings }) => ({
    ...Base.Adapters.Version.Settings.smart.fromDB(dbSettings, { defaultVoice: '' }),
    ...Config.pickNonEmptyFields(dbSettings, PLATFORM_ONLY_FILES),
    ...(error !== undefined && { error: error && Prompt.simple.fromDB(error) }),
    ...(globalNoMatch !== undefined && {
      globalNoMatch: { ...globalNoMatch, prompt: globalNoMatch.prompt && Prompt.simple.fromDB(globalNoMatch.prompt) },
    }),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.fromDB(globalNoReply.prompt) },
    }),
  }),
  ({ error, globalNoMatch, globalNoReply, ...settings }) => ({
    ...Base.Adapters.Version.Settings.smart.toDB(settings, { defaultVoice: '' }),
    ...Config.pickNonEmptyFields(settings, PLATFORM_ONLY_FILES),
    ...(error !== undefined && { error: error && Prompt.simple.toDB(error) }),
    ...(globalNoMatch !== undefined && {
      globalNoMatch: { ...globalNoMatch, prompt: globalNoMatch.prompt && Prompt.simple.toDB(globalNoMatch.prompt) },
    }),
    ...(globalNoReply !== undefined && {
      globalNoReply: { ...globalNoReply, prompt: globalNoReply.prompt && Prompt.simple.toDB(globalNoReply.prompt) },
    }),
  })
);

export const simple = createSimpleAdapter<Omit<ChatVersion.Settings, 'session'>, Models.Version.Settings.Model>(
  (dbSettings) => smart.fromDB(ChatVersion.defaultSettings(dbSettings)),
  (settings) => smart.toDB(settings)
);
