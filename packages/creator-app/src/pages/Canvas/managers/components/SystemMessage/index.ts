import * as Platform from '@voiceflow/platform-config';

import { projectTypeAware } from '@/hocs';

import { ChatMessage, VoiceMessage } from './components';
import { SystemMessageProps } from './types';

const SystemMessage = projectTypeAware<SystemMessageProps>({
  [Platform.Constants.ProjectType.CHAT]: ChatMessage as React.FC<SystemMessageProps>,
  [Platform.Constants.ProjectType.VOICE]: VoiceMessage as React.FC<SystemMessageProps>,
});

export default Object.assign(SystemMessage, {
  Chat: ChatMessage,
  Voice: VoiceMessage,
});
