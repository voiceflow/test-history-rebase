import type { GoogleVersion } from '@voiceflow/google-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import * as Common from '@/configs/common';

import type * as Models from '../../models';
import * as Publishing from './publishing';
import * as Session from './session';
import * as Settings from './settings';

export { Publishing, Session, Settings };

export const simple = createMultiAdapter<
  GoogleVersion.VoiceVersion,
  Models.Version.Model,
  Common.Voice.Adapters.Version.FromDBOptions
>(
  (version, options) => ({
    ...Common.Voice.Adapters.Version.simple.fromDB(version, {
      ...options,
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    status: version.platformData.status,
    session: Session.simple.fromDB(version.platformData.settings.session, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    settings: Settings.simple.fromDB(version.platformData.settings, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    publishing: Publishing.smart.fromDB(version.platformData.publishing, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = Common.Voice.Adapters.Version.extend({
  simple,

  session: Session.CONFIG,

  settings: Settings.CONFIG,

  publishing: Publishing.CONFIG,
})(Common.Voice.Adapters.Version.validate);

export type Config = typeof CONFIG;
