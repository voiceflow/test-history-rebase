import * as Platform from '@voiceflow/platform-config';

import { projectTypeAware } from '@/hocs';

import SystemMessage from '../../../SystemMessage';
import { VoicePrompt } from './components';
import { PromptProps } from './types';

const Prompt = projectTypeAware<PromptProps>({
  [Platform.Constants.ProjectType.CHAT]: SystemMessage.Chat as React.FC<PromptProps>,
  [Platform.Constants.ProjectType.VOICE]: VoicePrompt as React.FC<PromptProps>,
});

export default Prompt;
