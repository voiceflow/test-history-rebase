import React from 'react';

import { useAreIntentPromptsEmpty } from '@/hooks/intent';

import Hover, { HoverButtonProps } from './Hover';

export interface EntityPromptButtonProps extends Omit<HoverButtonProps, 'label' | 'pluralLabel'> {
  contextPrompts?: unknown[];
  hasExtraContext?: boolean;
}

const EntityPromptButton: React.FC<EntityPromptButtonProps> = ({ disabled, contextPrompts, hasExtraContext, ...props }) => {
  const promptsAreEmpty = useAreIntentPromptsEmpty(contextPrompts);

  return <Hover {...props} label="response" disabled={disabled || (!hasExtraContext && promptsAreEmpty)} pluralLabel="responses" />;
};

export default EntityPromptButton;
