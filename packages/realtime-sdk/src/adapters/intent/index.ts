import { createAdvancedProjectTypeSelector } from '@realtime-sdk/utils/platform';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import chatIntentAdapter from './chat';
import voiceIntentAdapter from './voice';

export * from './base';
export * from './chat';
export * from './voice';

const getProjectTypeIntentAdapter = createAdvancedProjectTypeSelector({
  [VoiceflowConstants.ProjectType.CHAT]: chatIntentAdapter,
  [VoiceflowConstants.ProjectType.VOICE]: voiceIntentAdapter,
});

export default getProjectTypeIntentAdapter;
