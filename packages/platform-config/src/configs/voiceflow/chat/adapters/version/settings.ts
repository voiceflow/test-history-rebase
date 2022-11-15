import * as Common from '@platform-config/configs/common';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as VoiceflowCommon from '../../../common';
import * as Models from '../../models';

export const smart = createSmartSimpleAdapter<VoiceflowVersion.ChatSettings, Models.Version.Settings.Model>(
  (dbSettings) => ({
    ...Common.Chat.Adapters.Version.Settings.smart.fromDB(dbSettings),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.fromDB(dbSettings),
  }),
  (settings) => ({
    ...Common.Chat.Adapters.Version.Settings.smart.toDB(settings),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.toDB(settings),
  })
);

export const simple = createSimpleAdapter<VoiceflowVersion.ChatSettings, Models.Version.Settings.Model>(
  (dbSettings) => smart.fromDB(VoiceflowVersion.defaultChatSettings(dbSettings)),
  (settings) => smart.toDB(settings)
);

export const CONFIG = Common.Chat.Adapters.Version.Settings.extend({
  smart,
  simple,
});

export type Config = typeof CONFIG;
