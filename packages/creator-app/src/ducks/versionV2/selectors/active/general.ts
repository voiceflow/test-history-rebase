import { ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { nameSelector } from '@/ducks/projectV2/selectors/active/base';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.VoiceflowVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const localesSelector = createSelector([settingsSelector], (settings) => settings?.locales ?? []);

export const invocationNameSelector = nameSelector;

export const messageDelaySelector = createSelector([settingsSelector], (settings) =>
  settings ? (settings as Omit<ChatVersion.Settings, 'session'>)?.messageDelay?.durationMilliseconds ?? 0 : 0
);
