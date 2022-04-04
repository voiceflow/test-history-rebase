import { createAdvancedProjectTypeSelectorV2 } from '@realtime-sdk/utils/platform';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import chatIntentAdapter from './chat';
import voiceIntentAdapter from './voice';

export * from './base';
export * from './chat';
export * from './voice';

const getProjectTypeIntentAdapter = createAdvancedProjectTypeSelectorV2({
  [VoiceflowConstants.ProjectType.CHAT]: chatIntentAdapter,
  [VoiceflowConstants.ProjectType.VOICE]: voiceIntentAdapter,
});

export default getProjectTypeIntentAdapter;
