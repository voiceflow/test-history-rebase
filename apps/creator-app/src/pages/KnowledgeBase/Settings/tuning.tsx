import { BaseModels } from '@voiceflow/base-types';
import { Box, Input, SectionV2, Select, TippyTooltip, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import type { KnowledgeBaseSettingsProps } from './content';

const METRIC_OPTIONS = ['IP', 'L2'];

interface Range {
  max: number;
  min: number;
}

const CHUNK_SIZE_RANGE: Range = {
  max: 2048,
  min: 128,
};
const CHUNK_OVERLAP_RANGE: Range = {
  max: 1024,
  min: 0,
};
const CHUNK_LIMIT_RANGE: Range = {
  max: 6,
  min: 1,
};

const validateNumber = (value: string, range?: { max?: number; min?: number }) => {
  let number = +value;

  if (range?.min) number = Math.max(number, range.min);
  if (range?.max) number = Math.min(number, range.max);
  return number;
};

// component with same props as Input
const ControlledNumberInput: React.FC<
  React.ComponentProps<typeof Input> & { value?: number; onBlurNumber: (value: number) => void; range?: Range }
> = ({ value, onBlurNumber, range, ...props }) => {
  const [state, setState] = useLinkedState(String(value) || '');

  const onBlurHandler = () => {
    const number = validateNumber(state, range);
    onBlurNumber(number);
    setState(String(number));
  };

  return <Input {...props} type="number" value={state} onChangeText={setState} onBlur={onBlurHandler} />;
};

// don't show tuning settings to users for now
const KnowledgeBaseTuning: React.FC<KnowledgeBaseSettingsProps> = ({ settings, setSettings }) => {
  const { chunkStrategy, search } = settings;

  const update = React.useCallback(
    <T extends keyof BaseModels.Project.KnowledgeBaseSettings>(property: T) =>
      (data: Partial<BaseModels.Project.KnowledgeBaseSettings[T]>) => {
        setSettings((settings) => (settings ? { ...settings, [property]: { ...settings[property], ...data } } : null));
      },
    []
  );

  return (
    <SectionV2.Content py={24}>
      <Box.Flex gap={12}>
        <Box.FlexColumn gap={11} alignItems="flex-start">
          <SectionV2.Title secondary bold>
            Chunk Size
          </SectionV2.Title>
          <ControlledNumberInput value={chunkStrategy.size} range={CHUNK_SIZE_RANGE} onBlurNumber={(size) => update('chunkStrategy')({ size })} />
        </Box.FlexColumn>
        <Box.FlexColumn gap={11} alignItems="flex-start">
          <SectionV2.Title secondary bold>
            Chunk Overlap
          </SectionV2.Title>
          <ControlledNumberInput
            value={chunkStrategy.overlap}
            range={CHUNK_OVERLAP_RANGE}
            onBlurNumber={(overlap) => update('chunkStrategy')({ overlap })}
          />
        </Box.FlexColumn>
        <Box.FlexColumn gap={11} alignItems="flex-start">
          <SectionV2.Title secondary bold>
            Metric
          </SectionV2.Title>
          <Select width="70px" options={METRIC_OPTIONS} value={search.metric} onSelect={(metric) => update('search')({ metric })} />
        </Box.FlexColumn>
        <Box.FlexColumn gap={11} alignItems="flex-start">
          <TippyTooltip
            delay={250}
            placement="top-start"
            content="Control the randomness of your completions, with higher temperatures being more random, and low temperature more deterministic."
          >
            <SectionV2.Title secondary bold>
              Chunk Limit
            </SectionV2.Title>
          </TippyTooltip>
          <ControlledNumberInput value={search.limit} range={CHUNK_LIMIT_RANGE} onBlurNumber={(limit) => update('search')({ limit })} />
        </Box.FlexColumn>
      </Box.Flex>
    </SectionV2.Content>
  );
};

export default KnowledgeBaseTuning;
