import { createAdvancedPlatformSelector } from '@realtime-sdk/utils/platform';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import chatIntentAdapter from './chat';
import voiceIntentAdapter from './voice';

export * from './base';
export * from './chat';
export * from './voice';

const getPlatformIntentAdapter = createAdvancedPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: chatIntentAdapter,
  },
  voiceIntentAdapter
);

export default getPlatformIntentAdapter;
