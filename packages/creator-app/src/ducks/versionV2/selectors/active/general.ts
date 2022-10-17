import { ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { logo } from '@/assets';
import { nameSelector } from '@/ducks/projectV2/selectors/active/base';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.VoiceflowVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

export const chatPublishingSelector = createSelector([versionSelector], (version) => {
  const config = (version?.publishing ?? {}) as Realtime.VoiceflowChatVersion['publishing'];

  return {
    ...config,
    image: config.image || logo,
    avatar: config.avatar || logo,
    position: config.position || 'RIGHT',
    spacing: { side: config.spacing?.side ?? 24, bottom: config.spacing?.bottom ?? 24 },
    title: config.title || 'Voiceflow Assistant',
    description: config.description || "Voiceflow's virtual assistant is here to help.",
    color: config.color || '#2E7FF1',
  };
});

export const localesSelector = createSelector([settingsSelector], (settings) => settings?.locales ?? []);

export const invocationNameSelector = nameSelector;

export const messageDelaySelector = createSelector([settingsSelector], (settings) =>
  settings ? (settings as Omit<ChatVersion.Settings, 'session'>)?.messageDelay?.durationMilliseconds ?? 0 : 0
);
