import * as Platform from '@voiceflow/platform-config';

import { platformFactory } from './utils';

// side effects

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Alexa.Voice.Models.Version.Session,
  Platform.Alexa.Voice.Models.Version.Settings.Model,
  Platform.Alexa.Voice.Models.Version.Publishing.Model
>();
