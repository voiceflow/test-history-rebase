import { BaseUtils } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import { Box, Slider } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';

import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingLabel } from './KBSettingLabel.component';

const TEST_ID = tid(SETTINGS_TEST_ID, 'tokens');

export interface IKBSettingsTokens {
  value: number;
  model: BaseUtils.ai.GPT_MODEL;
  disabled?: boolean;
  onValueChange: (tokens: number) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsTokens: React.FC<IKBSettingsTokens> = ({
  model,
  value,
  disabled,
  onValueChange,
  activeTooltipLabel,
  setTooltipActiveLabel,
}) => {
  const modelConfig = AI_MODEL_CONFIG_MAP[model];

  useEffect(() => {
    if (value <= modelConfig.maxTokens) return;

    onValueChange(modelConfig.maxTokens);
  }, [model]);

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="Max tokens"
        value={value}
        tooltipText="The maximum number of tokens that can be used to generate a single response."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        activeTooltipLabel={activeTooltipLabel}
        setTooltipActiveLabel={setTooltipActiveLabel}
      />

      <div style={{ paddingLeft: '24px' }}>
        <Slider
          min={10}
          max={modelConfig.maxTokens}
          step={1}
          marks={[10, modelConfig.maxTokens]}
          value={value}
          endLabel={modelConfig.maxTokens.toString()}
          disabled={disabled}
          startLabel="10"
          onValueChange={onValueChange}
          testID={TEST_ID}
        />
      </div>
    </Box>
  );
};
