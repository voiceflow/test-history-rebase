import type * as Platform from '@voiceflow/platform-config';

import type { BaseSystemMessageProps } from '@/components/SystemMessage/types';

export interface VoicePromptProps extends BaseSystemMessageProps {
  message: Platform.Common.Voice.Models.Prompt.Model;
  onChange: (message: Partial<Platform.Common.Voice.Models.Prompt.Model>) => void;
}

export interface VoicePromptRef {
  getCurrentValue: () => Platform.Common.Voice.Models.Prompt.Model;
}

export interface PromptProps extends BaseSystemMessageProps {
  message: Platform.Base.Models.Prompt.Model;
  onChange: (message: Partial<Platform.Base.Models.Prompt.Model>) => void;
}

export interface PromptRef extends BaseSystemMessageProps {
  getCurrentValue: () => Platform.Base.Models.Prompt.Model;
}
