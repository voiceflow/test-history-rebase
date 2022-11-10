import { createAdvancedProjectTypeSelector } from '@realtime-sdk/utils/platform';
import * as Platform from '@voiceflow/platform-config';

import { chatIntentAdapter, chatIntentSmartAdapter } from './chat';
import { voiceIntentAdapter, voiceIntentSmartAdapter } from './voice';

export * from './base';
export * from './chat';
export * from './voice';

export const getProjectTypeIntentAdapter = createAdvancedProjectTypeSelector({
  [Platform.Constants.ProjectType.CHAT]: chatIntentAdapter,
  [Platform.Constants.ProjectType.VOICE]: voiceIntentAdapter,
});

export const getProjectTypeIntentSmartAdapter = createAdvancedProjectTypeSelector({
  [Platform.Constants.ProjectType.CHAT]: chatIntentSmartAdapter,
  [Platform.Constants.ProjectType.VOICE]: voiceIntentSmartAdapter,
});
