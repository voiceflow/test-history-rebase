import type { AIModel } from '@voiceflow/dtos';
import { Input, SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';

export interface IAIPromptSettingsSystemInput {
  model: AIModel;
  value: string;
  onValueChange: (value: string) => void;
}

export const AIPromptSettingsSystemInput: React.FC<IAIPromptSettingsSystemInput> = ({
  model,
  value,
  onValueChange,
}) => {
  const [hasSystemContent, setHasSystemContent] = React.useState(false);

  if (!AI_MODEL_CONFIG_MAP[model].hasSystemPrompt) return null;

  return (
    <SectionV2.Content pb={0}>
      <TippyTooltip
        delay={250}
        content="Give the system a role it should play when creating your completions, to give it context on how it should respond."
        placement="top-start"
      >
        <SectionV2.Title mb={11} secondary bold>
          System
        </SectionV2.Title>
      </TippyTooltip>

      <Input.ScrollingPlaceholder
        hasContent={hasSystemContent}
        placeholders={['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent']}
      >
        <VariablesInput
          value={value}
          onBlur={({ text }) => onValueChange(text)}
          multiline
          placeholder="Enter prompt, '{' variable"
          newLineOnEnter
          onEditorStateChange={(state) => setHasSystemContent(state.getCurrentContent().hasText())}
        />
      </Input.ScrollingPlaceholder>
    </SectionV2.Content>
  );
};
