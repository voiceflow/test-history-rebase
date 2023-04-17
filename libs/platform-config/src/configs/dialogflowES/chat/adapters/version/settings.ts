import * as Common from '@platform-config/configs/common';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

export const smart = createSmartSimpleAdapter<
  DFESVersion.ChatSettings,
  Models.Version.Settings.Model,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions
>(Common.Chat.Adapters.Version.Settings.smart.fromDB, Common.Chat.Adapters.Version.Settings.smart.toDB);

export const simple = createSimpleAdapter<
  DFESVersion.ChatSettings,
  Models.Version.Settings.Model,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Chat.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(DFESVersion.defaultChatSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Chat.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Chat.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
