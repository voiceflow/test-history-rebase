import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Common from '@/configs/common';

import * as VoiceflowCommon from '../../../common';
import type * as Models from '../../models';

export const smart = createSmartSimpleAdapter<
  VoiceflowVersion.ChatSettings,
  Models.Version.Settings.Model,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => ({
    ...Common.Chat.Adapters.Version.Settings.smart.fromDB(dbSettings, options),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.fromDB(dbSettings),
  }),
  (settings, options) => ({
    ...Common.Chat.Adapters.Version.Settings.smart.toDB(settings, options),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.toDB(settings),
  })
);

export const simple = createSimpleAdapter<
  VoiceflowVersion.ChatSettings,
  Models.Version.Settings.Model,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(VoiceflowVersion.defaultChatSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Chat.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Chat.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
