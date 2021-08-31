import { PlatformType } from '@voiceflow/internal';

import { createAdvancedPlatformSelector } from '../../utils/platform';
import chatIntentAdapter from './chat';
import voiceIntentAdapter from './voice';

export * from './base';
export * from './chat';
export * from './voice';

const getPlatformIntentAdapter = createAdvancedPlatformSelector(
  {
    [PlatformType.CHATBOT]: chatIntentAdapter,
  },
  voiceIntentAdapter
);

export default getPlatformIntentAdapter;
