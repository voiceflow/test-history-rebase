import { createAdvancedProjectTypeSelector } from '@realtime-sdk/utils/platform';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { chatIntentAdapter, chatIntentSmartAdapter } from './chat';
import { voiceIntentAdapter, voiceIntentSmartAdapter } from './voice';

export * from './base';
export * from './chat';
export * from './voice';

export const getProjectTypeIntentAdapter = createAdvancedProjectTypeSelector({
  [VoiceflowConstants.ProjectType.CHAT]: chatIntentAdapter,
  [VoiceflowConstants.ProjectType.VOICE]: voiceIntentAdapter,
});

export const getProjectTypeIntentSmartAdapter = createAdvancedProjectTypeSelector({
  [VoiceflowConstants.ProjectType.CHAT]: chatIntentSmartAdapter,
  [VoiceflowConstants.ProjectType.VOICE]: voiceIntentSmartAdapter,
});
