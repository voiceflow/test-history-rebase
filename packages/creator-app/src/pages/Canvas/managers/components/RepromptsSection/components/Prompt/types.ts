import * as Platform from '@voiceflow/platform-config';

import { BaseSystemMessageProps } from '@/pages/Canvas/managers/components/SystemMessage/types';

export interface VoicePromptProps extends BaseSystemMessageProps {
  message: Platform.Common.Voice.Models.Prompt.Model;
  onChange: (message: Partial<Platform.Common.Voice.Models.Prompt.Model>) => void;
}

export interface PromptProps extends BaseSystemMessageProps {
  message: Platform.Base.Models.Prompt.Model;
  onChange: (message: Partial<Platform.Base.Models.Prompt.Model>) => void;
}
