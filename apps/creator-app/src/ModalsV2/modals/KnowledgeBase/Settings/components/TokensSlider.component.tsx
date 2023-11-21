import { BaseUtils } from '@voiceflow/base-types';
import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import { SettingsLabel } from './SettingLabel.component';

export interface ITokensSlider {
  tokens?: number;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

export const TokensSlider: React.FC<ITokensSlider> = ({ tokens = 128, onChange }) => {
  return (
    <Box width="100%" direction="column" pb={12}>
      <SettingsLabel
        label="Max tokens"
        value={tokens}
        tooltipText="The maximum number of tokens that can be used to generate a single response."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <Slider
        value={tokens}
        startLabel="10"
        endLabel="512"
        onValueChange={(tokens) => onChange({ maxTokens: tokens })}
        min={10}
        max={512}
        step={1}
        marks={[10, 512]}
      />
    </Box>
  );
};
