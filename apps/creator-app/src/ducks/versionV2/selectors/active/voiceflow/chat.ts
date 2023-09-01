import * as Platform from '@voiceflow/platform-config';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import * as ProjectV2 from '@/ducks/projectV2';

import { platformSelectorsFactory } from '../utils';

const platformSelectors = platformSelectorsFactory<Platform.Voiceflow.Chat.Models.Version.Model>();

export const { versionSelector, sessionSelector, settingsSelector } = platformSelectors;

export const DEFAULT_AVATAR = 'https://cdn.voiceflow.com/assets/logo.png';

export const publishingSelector = createSelector(
  [platformSelectors.publishingSelector, ProjectV2.active.nameSelector],
  (publishing, projectName) => ({
    ...publishing,
    // default values
    title: publishing?.title ?? projectName ?? 'Voiceflow Assistant',
    image: publishing?.image ?? DEFAULT_AVATAR,
    color: publishing?.color ?? '#2E7FF1',
    avatar: publishing?.avatar ?? DEFAULT_AVATAR,
    spacing: {
      side: publishing?.spacing?.side ?? 24,
      bottom: publishing?.spacing?.bottom ?? 24,
    },
    position: publishing?.position ?? VoiceflowVersion.ChatPosition.RIGHT,
    watermark: publishing?.watermark ?? true,
    feedback: publishing?.feedback ?? false,
    persistence: publishing?.persistence ?? VoiceflowVersion.ChatPersistence.LOCAL_STORAGE,
    description: publishing?.description ?? 'Our virtual assistant is here to help you.',
  })
);

export const messageDelaySelector = createSelector([settingsSelector], (settings) => settings?.messageDelay?.durationMilliseconds ?? 0);
