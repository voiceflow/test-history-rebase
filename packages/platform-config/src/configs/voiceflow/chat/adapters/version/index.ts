import * as Common from '@platform-config/configs/common';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';
import * as Project from '../../project';
import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export const simple = createMultiAdapter<VoiceflowVersion.ChatVersion, Models.Version.Model>(
  (version) => ({
    ...Common.Chat.Adapters.Version.simple.fromDB(version, { globalVariables: Project.CONFIG.globalVariables }),
    status: null,
    settings: Settings.simple.fromDB(version.platformData.settings),
    publishing: Publishing.smart.fromDB(version.platformData.publishing),
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = Common.Chat.Adapters.Version.extend({
  simple,

  settings: Settings.CONFIG,

  publishing: Publishing.CONFIG,
});

export type Config = typeof CONFIG;
