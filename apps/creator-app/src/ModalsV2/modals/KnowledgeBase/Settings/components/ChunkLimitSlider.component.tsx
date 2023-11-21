import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import { SettingsLabel } from './SettingLabel.component';

export interface IChunkLimitSlider {
  chunkLimit?: number;
  onChange: (data: Partial<{ limit: number; metric: string }>) => void;
}

export const ChunkLimitSlider: React.FC<IChunkLimitSlider> = ({ chunkLimit = 2, onChange }) => {
  return (
    <Box width="100%" direction="column" pb={12}>
      <SettingsLabel
        label="Chunk limit"
        value={chunkLimit}
        tooltipText="Determines how many data source chunks will be passed to the LLM as context to generate a response. We recommend 2-3 to avoid LLM confusion."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <Slider
        value={chunkLimit}
        startLabel="1"
        endLabel="10"
        onValueChange={(chunkLimit) => onChange({ limit: chunkLimit })}
        min={1}
        max={10}
        marks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      />
    </Box>
  );
};
