import type { DFESVersion } from '@voiceflow/google-dfes-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Common from '@/configs/common';

import type * as Models from '../../models';
import * as Publishing from './publishing';
import * as Settings from './settings';

export { Publishing, Settings };

export const simple = createMultiAdapter<
  DFESVersion.ChatVersion,
  Models.Version.Model,
  Common.Chat.Adapters.Version.FromDBOptions
>(
  (version, options) => ({
    ...Common.Chat.Adapters.Version.simple.fromDB(version, options),
    status: version.platformData.status,
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
