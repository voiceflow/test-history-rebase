import { tid } from '@voiceflow/style';
import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { KBSettingLabel } from './KBSettingLabel.component';

const TEST_ID = tid(SETTINGS_TEST_ID, 'chunk-limit');

export interface IKBSettingsChunkLimit {
  value: number;
  disabled?: boolean;
  onValueChange: (limit: number) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsChunkLimit: React.FC<IKBSettingsChunkLimit> = ({
  value,
  disabled,
  activeTooltipLabel,
  setTooltipActiveLabel,
  onValueChange,
}) => (
  <Box width="100%" direction="column" pb={12}>
    <KBSettingLabel
      label="Chunk limit"
      value={value}
      tooltipText="Determines how many data source chunks will be passed to the LLM as context to generate a response. We recommend 2-3 to avoid LLM confusion."
      tooltipLearnMore={CMS_KNOWLEDGE_BASE_LEARN_MORE}
      activeTooltipLabel={activeTooltipLabel}
      setTooltipActiveLabel={setTooltipActiveLabel}
    />

    <div style={{ paddingLeft: '24px' }}>
      <Slider
        min={1}
        max={10}
        value={value}
        marks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        disabled={disabled}
        endLabel="10"
        startLabel="1"
        onValueChange={onValueChange}
        testID={TEST_ID}
      />
    </div>
  </Box>
);
