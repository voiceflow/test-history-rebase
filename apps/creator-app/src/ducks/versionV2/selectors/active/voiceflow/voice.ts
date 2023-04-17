import * as Platform from '@voiceflow/platform-config';

import { platformSelectorsFactory } from '../utils';

export const { versionSelector, sessionSelector, settingsSelector, publishingSelector } =
  platformSelectorsFactory<Platform.Voiceflow.Voice.Models.Version.Model>();
