import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsTokens {
  value: number;
  disabled?: boolean;
  onValueChange: (tokens: number) => void;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingsTokens: React.FC<IKBSettingsTokens> = ({ value, activeTooltipLabel, disabled, setTooltipActiveLabel, onValueChange }) => {
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
      <Slider
        min={10}
        max={512}
        step={1}
        marks={[10, 512]}
        value={value}
        endLabel="512"
        disabled={disabled}
        startLabel="10"
        onValueChange={onValueChange}
      />
    </Box>
  );
};
