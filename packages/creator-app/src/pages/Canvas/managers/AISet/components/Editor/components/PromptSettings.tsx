import { BaseUtils } from '@voiceflow/base-types';
import { Box, Input, SectionV2, Select } from '@voiceflow/ui';
import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';
import VariablesInput from '@/components/VariablesInput';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const MODEL_LABELS = {
  [BaseUtils.ai.GPT_MODEL.DaVinci_003]: 'GPT-3 DaVinci',
  [BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo]: 'GPT-3.5 Turbo (ChatGPT)',
  [BaseUtils.ai.GPT_MODEL.GPT_4]: 'GPT-4',
};

const MODELS = Object.values(BaseUtils.ai.GPT_MODEL);

const SYSTEM_PLACEHOLDERS = ['You are a helpful Assistant', 'You are a Spanish tutor', 'You are a Travel Agent'];

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');
  return `${start}.${end.padEnd(padding, '0')}`;
};

const PromptSettings: React.FC<{ data: BaseUtils.ai.AIModelParams; onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void }> = ({
  data: { model = BaseUtils.ai.GPT_MODEL.DaVinci_003, system = '', maxTokens = 128, temperature = 0.7 },
  onChange,
}) => {
  const [hasSystemContent, setHasSystemContent] = React.useState(false);

  return (
    <EditorV2.PersistCollapse namespace={['promptSettings']}>
      {({ collapsed, onToggle }) => (
        <SectionV2.CollapseSection
          collapsed={collapsed}
          onToggle={onToggle}
          header={({ collapsed, onToggle }) => (
            <SectionV2.Header onClick={onToggle} sticky>
              <SectionV2.Title bold={!collapsed}>Prompt settings</SectionV2.Title>
              <SectionV2.CollapseArrowIcon collapsed={collapsed} />
            </SectionV2.Header>
          )}
        >
          <Box pb={12}>
            <SectionV2.Content pb={16} pt={4}>
              <Select
                clearable={false}
                getOptionLabel={(model) => MODEL_LABELS[model!]}
                options={MODELS}
                value={model}
                onSelect={(model) => (model ? onChange?.({ model }) : undefined)}
              />
            </SectionV2.Content>
            <SectionV2.Content pb={12}>
              <SectionV2.Title secondary bold>
                Temperature
              </SectionV2.Title>
              <SliderInputGroup
                sliderProps={{ min: 0, max: 1, step: 0.05 }}
                inputProps={{ maxLength: 4 }}
                value={temperature}
                onChange={(temperature) => onChange({ temperature })}
                textModifer={paddedDecimalString}
              />
            </SectionV2.Content>
            <SectionV2.Content pb={12}>
              <SectionV2.Title mb={8} secondary bold>
                Max Tokens
              </SectionV2.Title>
              <SliderInputGroup
                sliderProps={{ min: 1, max: 2048, step: 1 }}
                inputProps={{ maxLength: 4 }}
                value={maxTokens}
                onChange={(maxTokens) => onChange({ maxTokens })}
              />
            </SectionV2.Content>
            {BaseUtils.ai.ChatModels.includes(model) && (
              <SectionV2.Content pb={12}>
                <SectionV2.Title mb={8} secondary bold>
                  System
                </SectionV2.Title>
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
          </Box>
        </SectionV2.CollapseSection>
      )}
    </EditorV2.PersistCollapse>
  );
};

export default PromptSettings;
