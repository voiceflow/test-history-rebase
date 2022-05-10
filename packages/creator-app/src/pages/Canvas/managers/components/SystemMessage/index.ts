import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { projectTypeAware } from '@/hocs';

import { ChatMessage, VoiceMessage } from './components';
import { SystemMessageProps } from './types';

const SystemMessage = projectTypeAware<SystemMessageProps>({
  [VoiceflowConstants.ProjectType.CHAT]: ChatMessage as React.FC<SystemMessageProps>,
  [VoiceflowConstants.ProjectType.VOICE]: VoiceMessage as React.FC<SystemMessageProps>,
});

export default Object.assign(SystemMessage, {
  Chat: ChatMessage,
  Voice: VoiceMessage,
});
