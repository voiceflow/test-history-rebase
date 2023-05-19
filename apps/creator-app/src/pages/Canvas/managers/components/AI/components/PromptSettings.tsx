import { BaseUtils } from '@voiceflow/base-types';
import { Input, SectionV2, Select, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';
import VariablesInput from '@/components/VariablesInput';

const MODEL_LABELS = {
  [BaseUtils.ai.GPT_MODEL.DaVinci_003]: 'GPT-3 DaVinci',
  [BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo]: 'GPT-3.5 Turbo (ChatGPT)',
  [BaseUtils.ai.GPT_MODEL.GPT_4]: 'GPT-4',
};

const MODELS = Object.values(BaseUtils.ai.GPT_MODEL);

const SYSTEM_PLACEHOLDERS = ['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent'];

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');
  return `${start}.${end.padEnd(padding, '0')}`;
};

export interface PromptSettingsProps {
  data: BaseUtils.ai.AIModelParams;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

const PromptSettings: React.FC<PromptSettingsProps> = ({
  data: { model = BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo, system = '', maxTokens = 128, temperature = 0.7 },
  onChange,
}) => {
  const [hasSystemContent, setHasSystemContent] = React.useState(false);

  return (
    <>
      <SectionV2.Content pb={20}>
        <Select
          clearable={false}
          getOptionLabel={(model) => MODEL_LABELS[model!]}
          options={MODELS}
          value={model}
          onSelect={(model) => (model ? onChange?.({ model }) : undefined)}
        />
      </SectionV2.Content>
      <SectionV2.Content pb={12}>
        <TippyTooltip
          delay={250}
          placement="top-start"
          content="Control the randomness of your completions, with higher temperatures being more random, and low temperature more deterministic."
        >
          <SectionV2.Title secondary bold>
            Temperature
          </SectionV2.Title>
        </TippyTooltip>
        <SliderInputGroup
          sliderProps={{ min: 0, max: 1, step: 0.05 }}
          inputProps={{ maxLength: 4 }}
          value={temperature}
          onChange={(temperature) => onChange({ temperature })}
          textModifer={paddedDecimalString}
        />
      </SectionV2.Content>
      <SectionV2.Content pb={12}>
        <TippyTooltip
          delay={250}
          placement="top-start"
          content="The maximum number of tokens that can be used to generate your completion. 1 Token is approximately 4 characters in English completions."
        >
          <SectionV2.Title secondary bold>
            Max Tokens
          </SectionV2.Title>
        </TippyTooltip>
        <SliderInputGroup
          sliderProps={{ min: 1, max: 1024, step: 1 }}
          inputProps={{ maxLength: 4 }}
          value={maxTokens}
          onChange={(maxTokens) => onChange({ maxTokens })}
        />
      </SectionV2.Content>
      {BaseUtils.ai.ChatModels.includes(model) && (
        <SectionV2.Content pb={12}>
          <TippyTooltip
            delay={250}
            placement="top-start"
            content="Give the system a role it should play when creating your completions, to give it context on how it should respond."
          >
            <SectionV2.Title mb={11} secondary bold>
              System
            </SectionV2.Title>
          </TippyTooltip>
          <Input.ScrollingPlaceholder placeholders={SYSTEM_PLACEHOLDERS} hasContent={hasSystemContent}>
            <VariablesInput
              multiline
              placeholder="Enter prompt, '{' variable"
              newLineOnEnter
              value={system}
              onBlur={({ text }) => onChange({ system: text })}
              onEditorStateChange={(state) => setHasSystemContent(state.getCurrentContent().hasText())}
            />
          </Input.ScrollingPlaceholder>
        </SectionV2.Content>
      )}
    </>
  );
};

export default PromptSettings;
