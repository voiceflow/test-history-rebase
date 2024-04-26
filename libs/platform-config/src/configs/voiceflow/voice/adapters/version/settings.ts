import * as Common from '@platform-config/configs/common';
import type { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as VoiceflowCommon from '../../../common';
import type * as Models from '../../models';

export const smart = createSmartSimpleAdapter<
  VoiceflowVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => ({
    ...Common.Voice.Adapters.Version.Settings.smartFactory<VoiceflowConstants.Voice>().fromDB(dbSettings, options),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.fromDB(dbSettings),
  }),
  (settings, options) => ({
    ...Common.Voice.Adapters.Version.Settings.smartFactory<VoiceflowConstants.Voice>().toDB(settings, options),
    ...VoiceflowCommon.Adapters.Version.Settings.smart.toDB(settings),
  })
);

export const simple = createSimpleAdapter<
  VoiceflowVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(VoiceflowVersion.defaultVoiceSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
