import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import type { VoiceVersion } from '@voiceflow/voice-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';
import * as Publishing from './publishing';
import * as Session from './session';
import * as Settings from './settings';

export { Publishing, Session, Settings };

export type FromDBOptions = Base.Adapters.Version.FromDBOptions;

export const simple = createMultiAdapter<
  Base.Adapters.Version.DBVersion<VoiceVersion.Version<string>>,
  Models.Version.Model,
  FromDBOptions
>(
  (version, options) => ({
    ...Base.Adapters.Version.simple.fromDB(version, options),
    session: Session.simple.fromDB(version.platformData.settings.session, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    settings: Settings.simple.fromDB(version.platformData.settings, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    publishing: Publishing.simple.fromDB(version.platformData.publishing, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = Base.Adapters.Version.extend({
  simple,

  session: Session.CONFIG,

  settings: Settings.CONFIG,

  publishing: Publishing.CONFIG,
})(Base.Adapters.Version.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
