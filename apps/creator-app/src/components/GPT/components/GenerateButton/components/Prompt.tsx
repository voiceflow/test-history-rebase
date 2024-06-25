import type * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { useArePromptsEmpty } from '@/hooks';

import type { HoverButtonProps } from './Hover';
import Hover from './Hover';

export interface PromptButtonProps extends HoverButtonProps {
  contextPrompts?: Platform.Base.Models.Prompt.Model[];
  hasExtraContext?: boolean;
}

const PromptButton: React.FC<PromptButtonProps> = ({ disabled, contextPrompts, hasExtraContext, ...props }) => {
  const promptsAreEmpty = useArePromptsEmpty(contextPrompts);

  return <Hover {...props} disabled={disabled || (!hasExtraContext && promptsAreEmpty)} />;
};

export default PromptButton;
