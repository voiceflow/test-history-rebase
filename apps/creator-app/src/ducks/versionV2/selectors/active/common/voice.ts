import type * as Platform from '@voiceflow/platform-config';
import { createSelector } from 'reselect';

import { projectConfigSelector } from '@/ducks/projectV2/selectors/active';

import { platformSelectorsFactory } from '../utils';

export const { versionSelector, sessionSelector, settingsSelector, publishingSelector } =
  platformSelectorsFactory<Platform.Common.Voice.Models.Version.Model>();

export const defaultVoiceSelector = createSelector(
  [settingsSelector, projectConfigSelector],
  (settings, projectConfig) => settings?.defaultVoice ?? projectConfig.project.voice.default
);
