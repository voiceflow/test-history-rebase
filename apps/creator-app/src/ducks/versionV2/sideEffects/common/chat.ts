import type * as Platform from '@voiceflow/platform-config';

import { platformFactory } from '../utils';

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Common.Chat.Models.Version.Session,
  Platform.Common.Chat.Models.Version.Settings.Model,
  Platform.Common.Chat.Models.Version.Publishing.Model
>();
