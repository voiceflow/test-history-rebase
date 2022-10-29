import { ChatVersion } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import * as Project from '@/ducks/projectV2/selectors';
import { nameSelector } from '@/ducks/projectV2/selectors/active/base';

import { versionSelector as activeVersionSelector } from './base';

export const versionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<Realtime.VoiceflowVersion>);

export const settingsSelector = createSelector([versionSelector], (version) => version?.settings ?? null);

const DEFAULT_AVATAR = 'https://cdn.voiceflow.com/assets/logo.png';

export const chatPublishingSelector = createSelector([versionSelector, Project.active.nameSelector], (version, projectName) => {
  const config = (version?.publishing ?? {}) as Realtime.VoiceflowChatVersion['publishing'];

  return {
    ...config,
    // default values
    title: config.title ?? projectName ?? 'Voiceflow Assistant',
    image: config.image ?? DEFAULT_AVATAR,
    avatar: config.avatar ?? DEFAULT_AVATAR,
    position: config.position ?? VoiceflowVersion.ChatPosition.RIGHT,
    persistence: config.persistence ?? VoiceflowVersion.ChatPersistence.LOCAL_STORAGE,
    spacing: { side: config.spacing?.side ?? 24, bottom: config.spacing?.bottom ?? 24 },
    description: config.description ?? 'Our virtual assistant is here to help you.',
    color: config.color ?? '#2E7FF1',
    watermark: config.watermark ?? true,
  };
});

export const localesSelector = createSelector([settingsSelector], (settings) => settings?.locales ?? []);

export const invocationNameSelector = nameSelector;

export const messageDelaySelector = createSelector([settingsSelector], (settings) =>
  settings ? (settings as Omit<ChatVersion.Settings, 'session'>)?.messageDelay?.durationMilliseconds ?? 0 : 0
);
