import type * as Base from '@platform-config/configs/base';
import * as Common from '@platform-config/configs/common';
import type { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';
import * as Session from './session';
import * as Settings from './settings';

export { Session, Settings };

export const simple = createMultiAdapter<
  Base.Adapters.Version.DBVersion<VoiceflowVersion.VoiceVersion>,
  Models.Version.Model,
  Common.Voice.Adapters.Version.FromDBOptions
>(
  (version, options) => ({
    ...Common.Voice.Adapters.Version.simple.fromDB(version, {
      ...options,
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    status: null,
    session: Session.simple.fromDB(version.platformData.settings.session, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
    settings: Settings.simple.fromDB(version.platformData.settings, {
      defaultVoice: version.platformData.settings.defaultVoice ?? options.defaultVoice,
    }),
  }),
  notImplementedAdapter.transformer
);

export const CONFIG = Common.Voice.Adapters.Version.extend({
  simple,

  session: Session.CONFIG,

  settings: Settings.CONFIG,
})(Common.Voice.Adapters.Version.validate);

export type Config = typeof CONFIG;
