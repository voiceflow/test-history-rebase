import { BaseUtils } from '@voiceflow/base-types';
import { AIGPTModel } from '@voiceflow/dtos';
import { Box, Input, SectionV2, Select, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';
import VariablesInput from '@/components/VariablesInput';
import { CLOUD_ENV, PRIVATE_LLM_MODELS } from '@/config';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

const MODEL_LABELS: Record<string, { name: string; info: string; disabled?: boolean; deprecated?: boolean }> = {
  [AIGPTModel.DaVinci_003]: { name: 'GPT-3 DaVinci', info: '1x Tokens', deprecated: true },
  [AIGPTModel.GPT_3_5_turbo]: { name: 'GPT-3.5 Turbo (ChatGPT)', info: '0.75x Tokens' },
  [AIGPTModel.CLAUDE_INSTANT_V1]: { name: 'Claude Instant 1.2', info: '1x Tokens' },
  [AIGPTModel.CLAUDE_V1]: { name: 'Claude 1', info: '10x Tokens' },
  [AIGPTModel.CLAUDE_V2]: { name: 'Claude 2', info: '10x Tokens' },
  [AIGPTModel.GPT_4]: { name: 'GPT-4', info: '25x Tokens' },
  [AIGPTModel.GPT_4_TURBO]: { name: 'GPT-4 Turbo (coming soon)', info: '12x Tokens', disabled: true },
};

// add label prefix
Object.values(MODEL_LABELS).forEach((model) => {
  if (PRIVATE_LLM_MODELS) model.name = `${CLOUD_ENV.toUpperCase()} ${model.name}`;
});

const SYSTEM_PROMPT_MODELS = new Set<string>([
  AIGPTModel.CLAUDE_INSTANT_V1,
  AIGPTModel.CLAUDE_V1,
  AIGPTModel.CLAUDE_V2,
  AIGPTModel.GPT_3_5_turbo,
  AIGPTModel.GPT_4,
]);

const ADVANCED_LLM_MODELS = new Set<string>([AIGPTModel.GPT_4, AIGPTModel.CLAUDE_V1, AIGPTModel.CLAUDE_V2]);

const SYSTEM_PLACEHOLDERS = ['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent'];

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');
  return `${start}.${end.padEnd(padding, '0')}`;
};

export interface PromptSettingsProps<D = {}> extends React.ComponentProps<typeof Box.FlexColumn> {
  data: BaseUtils.ai.AIModelParams & D;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams> & D) => void;
}

const PromptSettings: React.FC<PromptSettingsProps> = ({
  data: { model = AIGPTModel.GPT_3_5_turbo as AIGPTModel, system = '', maxTokens = 128, temperature = 0.7 },
  onChange,
  ...containerProps
}) => {
  const [hasSystemContent, setHasSystemContent] = React.useState(false);

  const advancedLLMModels = usePermission(Permission.ADVANCED_LLM_MODELS);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);

  const isReverseTrial = isTrial && !isEnterprise;

  const paymentModal = usePaymentModal();

  const options = React.useMemo(() => {
    return (Object.keys(MODEL_LABELS) as AIGPTModel[])
      .filter((model) => {
        if (PRIVATE_LLM_MODELS) return PRIVATE_LLM_MODELS.has(model);
        if (MODEL_LABELS[model]?.deprecated) return false;
        return true;
      })
      .map((model) => {
        const privilaged = (!advancedLLMModels.allowed || isReverseTrial) && ADVANCED_LLM_MODELS.has(model);
        return {
          name: MODEL_LABELS[model].name,
          value: model,
          info: !PRIVATE_LLM_MODELS && MODEL_LABELS[model].info,
          privilaged,
          disabled: MODEL_LABELS[model].disabled || privilaged,
        };
      });
  }, [advancedLLMModels.allowed, isReverseTrial]);

  return (
    <Box.FlexColumn alignItems="stretch" gap={12} {...containerProps}>
      <SectionV2.Content pb={8}>
        <Select
          clearable={false}
          renderOptionLabel={(model, _searchLabel, _getOptionLabel, _getOptionValue, config) => {
            const Item = (
              <Box.FlexApart fullWidth>
                {model.name}
                <Box color={ThemeColor.SECONDARY} fontSize={13}>
                  {model.info}
                </Box>
              </Box.FlexApart>
            );

            if (model.privilaged) {
              return (
                <TippyTooltip
                  interactive
                  style={{ width: '100%' }}
                  placement="left"
                  offset={[0, 24]}
                  width={232}
                  content={
                    <TippyTooltip.FooterButton
                      onClick={async () => {
                        config.close?.();
                        paymentModal.openVoid({});
                      }}
                      buttonText="Upgrade to Pro"
                    >
                      <b>{model.name}</b> is available on our paid plans.
                    </TippyTooltip.FooterButton>
                  }
                >
                  {Item}
                </TippyTooltip>
              );
            }

            return Item;
          }}
          getOptionKey={(option) => option.value}
          getOptionValue={(option) => option?.value}
          getOptionLabel={(model) => MODEL_LABELS[model!]?.name}
          options={options}
          value={model}
          onSelect={(model) => (model ? onChange?.({ model: model as unknown as BaseUtils.ai.GPT_MODEL }) : undefined)}
        />
      </SectionV2.Content>

      <SectionV2.Content pb={0}>
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
      <SectionV2.Content pb={0}>
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
          sliderProps={{ min: 1, max: 2000, step: 1 }}
          inputProps={{ maxLength: 4 }}
          value={maxTokens}
          onChange={(maxTokens) => onChange({ maxTokens })}
        />
      </SectionV2.Content>
      {SYSTEM_PROMPT_MODELS.has(model) && (
        <SectionV2.Content pb={0}>
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
    </Box.FlexColumn>
  );
};

export default PromptSettings;
