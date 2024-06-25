import type * as Platform from '@voiceflow/platform-config';

import { platformFactory } from '../utils';

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Voiceflow.Chat.Models.Version.Session,
  Platform.Voiceflow.Chat.Models.Version.Settings.Model,
  Platform.Voiceflow.Chat.Models.Version.Publishing.Model
>();
