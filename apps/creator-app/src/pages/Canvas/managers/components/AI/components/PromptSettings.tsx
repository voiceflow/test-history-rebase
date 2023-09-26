import { BaseUtils } from '@voiceflow/base-types';
import { Box, Input, SectionV2, Select, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';
import VariablesInput from '@/components/VariablesInput';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { usePaymentModal } from '@/ModalsV2/hooks';

const MODEL_LABELS = {
  [BaseUtils.ai.GPT_MODEL.DaVinci_003]: { name: 'GPT-3 DaVinci', info: '1x Tokens' },
  [BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo]: { name: 'GPT-3.5 Turbo (ChatGPT)', info: '1x Tokens' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_INSTANT_V1]: { name: 'Claude Instant 1.2', info: '1x Tokens' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_V1]: { name: 'Claude 1', info: '10x Tokens' },
  [BaseUtils.ai.GPT_MODEL.CLAUDE_V2]: { name: 'Claude 2', info: '10x Tokens' },
  [BaseUtils.ai.GPT_MODEL.GPT_4]: { name: 'GPT-4', info: '25x Tokens' },
};

const SYSTEM_PROMPT_MODELS = new Set([
  BaseUtils.ai.GPT_MODEL.CLAUDE_INSTANT_V1,
  BaseUtils.ai.GPT_MODEL.CLAUDE_V1,
  BaseUtils.ai.GPT_MODEL.CLAUDE_V2,
  BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo,
  BaseUtils.ai.GPT_MODEL.GPT_4,
]);

const ADVANCED_LLM_MODELS = new Set([BaseUtils.ai.GPT_MODEL.GPT_4, BaseUtils.ai.GPT_MODEL.CLAUDE_V1, BaseUtils.ai.GPT_MODEL.CLAUDE_V2]);

const SYSTEM_PLACEHOLDERS = ['You are a helpful assistant', 'You are a spanish tutor', 'You are a travel agent'];

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');
  return `${start}.${end.padEnd(padding, '0')}`;
};

export interface PromptSettingsProps extends React.ComponentProps<typeof Box.FlexColumn> {
  data: BaseUtils.ai.AIModelParams;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

const PromptSettings: React.FC<PromptSettingsProps> = ({
  data: { model = BaseUtils.ai.GPT_MODEL.GPT_3_5_turbo, system = '', maxTokens = 128, temperature = 0.7 },
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
    return (Object.keys(MODEL_LABELS) as BaseUtils.ai.GPT_MODEL[]).map((model) => ({
      name: MODEL_LABELS[model].name,
      value: model,
      info: MODEL_LABELS[model].info,
      disabled: (!advancedLLMModels.allowed || isReverseTrial) && ADVANCED_LLM_MODELS.has(model),
    }));
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

            if (model.disabled) {
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
          onSelect={(model) => (model ? onChange?.({ model }) : undefined)}
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
          sliderProps={{ min: 1, max: 512, step: 1 }}
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
