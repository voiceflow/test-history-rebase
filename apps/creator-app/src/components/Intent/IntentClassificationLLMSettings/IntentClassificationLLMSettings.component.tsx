import { DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Link, Section, Slider } from '@voiceflow/ui-next';
import React from 'react';

import { AIModelSelect } from '@/components/AI/AIModelSelect/AIModelSelect.component';
import { CodePreviewWithFullScreenEditor } from '@/components/Code/CodePreviewWithFullScreenEditor/CodePreviewWithFullScreenEditor.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import {
  LLM_INTENT_CLASSIFICATION_MODEL_LEARN_MORE,
  LLM_INTENT_CLASSIFICATION_PROMPT_LEARN_MORE,
  LLM_INTENT_CLASSIFICATION_TEMPERATURE_LEARN_MORE,
} from '@/constants/link.constant';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { IIntentClassificationLLMSettings } from './IntentClassificationLLMSettings.interface';

export const IntentClassificationLLMSettings: React.FC<IIntentClassificationLLMSettings> = ({
  settings,
  disabled,
  initialPromptWrapper,
  onSettingsChange,
}) => {
  const TEST_ID = 'intent-classification-llm-settings';

  const { params } = settings;
  const promptWrapper = settings.promptWrapper ?? DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER;

  const onParamsChange = (value: Partial<IIntentClassificationLLMSettings['settings']['params']>) => {
    onSettingsChange({ ...settings, params: { ...params, ...value } });
  };

  const onPromptWrapperChange = (value: Partial<IIntentClassificationLLMSettings['settings']['promptWrapper']>) => {
    onSettingsChange({ ...settings, promptWrapper: { ...promptWrapper, ...value } });
  };

  const onResetPromptWrapper = () => {
    onSettingsChange({ ...settings, promptWrapper: initialPromptWrapper });
  };

  const defaultedInitialPromptWrapper = initialPromptWrapper ?? DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER;

  return (
    <>
      <Section.Header.Container
        variant="active"
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="AI model"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(LLM_INTENT_CLASSIFICATION_MODEL_LEARN_MORE)}
          >
            The large language model (LLM) your agent will use to fetch and compile data.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      />

      <Box px={24} pb={16} direction="column">
        <AIModelSelect
          value={params.model}
          testID={tid(TEST_ID, 'model-select')}
          disabled={disabled}
          onValueChange={(model) => onParamsChange({ model })}
        />
      </Box>

      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Temperature"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(LLM_INTENT_CLASSIFICATION_TEMPERATURE_LEARN_MORE)}
          >
            Control the randomness of the answer the LLM provides.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{params.temperature.toFixed(2)}</Section.Header.Caption>
      </Section.Header.Container>

      <Box px={24} pt={4} pb={12} direction="column">
        <Slider
          min={0}
          max={1}
          marks={[0, 1]}
          value={params.temperature}
          testID={tid(TEST_ID, 'temperature-slider')}
          endLabel="Random"
          disabled={disabled}
          startLabel="Deterministic"
          onValueChange={(temperature) => onParamsChange({ temperature })}
        />
      </Box>

      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Prompt"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(LLM_INTENT_CLASSIFICATION_PROMPT_LEARN_MORE)}
          >
            Modify the wrapper prompt to tailor the agent's context and instructions for your specific use case.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        {promptWrapper.content !== defaultedInitialPromptWrapper.content && (
          <Link size="small" label="Reset" disabled={disabled} testID={tid(TEST_ID, 'reset')} weight="semiBold" onClick={onResetPromptWrapper} />
        )}
      </Section.Header.Container>

      <Box px={24} pb={24} direction="column">
        <CodePreviewWithFullScreenEditor
          code={promptWrapper.content}
          testID={tid(TEST_ID, 'prompt')}
          disabled={disabled}
          onCodeChange={(content) => onPromptWrapperChange({ content })}
          isFunctionEditor
          headerButtonProps={{ iconName: 'Question', onClick: onOpenURLInANewTabFactory(LLM_INTENT_CLASSIFICATION_PROMPT_LEARN_MORE) }}
          autoFocusLineNumber={2}
        />
      </Box>
    </>
  );
};
