import { AIModel } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { AIModelSelect } from '@/components/AI/AIModelSelect/AIModelSelect.component';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsModelSelect {
  value: AIModel;
  disabled?: boolean;
  onValueChange: (model: AIModel) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsModelSelect: React.FC<IKBSettingsModelSelect> = ({
  value,
  disabled,
  activeTooltipLabel,
  setTooltipActiveLabel,
  onValueChange,
}) => {
  const TEST_ID = tid(SETTINGS_TEST_ID, 'model');

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="AI model"
        tooltipText="The large language model (LLM) your agent will use to fetch and compile data."
        tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
        activeTooltipLabel={activeTooltipLabel}
        setTooltipActiveLabel={setTooltipActiveLabel}
      />

      <Box pl={24}>
        <AIModelSelect value={value} testID={TEST_ID} disabled={disabled} onValueChange={onValueChange} />
      </Box>
    </Box>
  );
};
