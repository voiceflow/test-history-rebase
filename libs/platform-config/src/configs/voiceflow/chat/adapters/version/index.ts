import * as Common from '@platform-config/configs/common';
import type { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';
import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export const simple = createMultiAdapter<
  VoiceflowVersion.ChatVersion,
  Models.Version.Model,
  Common.Chat.Adapters.Version.FromDBOptions
>(
  (version, options) => ({
    ...Common.Chat.Adapters.Version.simple.fromDB(version, options),
    status: null,
    settings: Settings.simple.fromDB(version.platformData.settings, options),
    publishing: Publishing.smart.fromDB(version.platformData.publishing, options),
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = Common.Chat.Adapters.Version.extend({
  simple,

  settings: Settings.CONFIG,

  publishing: Publishing.CONFIG,
})(Common.Chat.Adapters.Version.validate);

export type Config = typeof CONFIG;
