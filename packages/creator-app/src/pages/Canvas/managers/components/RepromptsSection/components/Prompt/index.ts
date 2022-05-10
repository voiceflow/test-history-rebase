import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { projectTypeAware } from '@/hocs';

import SystemMessage from '../../../SystemMessage';
import { VoicePrompt } from './components';
import { PromptProps } from './types';

const Prompt = projectTypeAware<PromptProps>({
  [VoiceflowConstants.ProjectType.CHAT]: SystemMessage.Chat as React.FC<PromptProps>,
  [VoiceflowConstants.ProjectType.VOICE]: VoicePrompt as React.FC<PromptProps>,
});

export default Prompt;
