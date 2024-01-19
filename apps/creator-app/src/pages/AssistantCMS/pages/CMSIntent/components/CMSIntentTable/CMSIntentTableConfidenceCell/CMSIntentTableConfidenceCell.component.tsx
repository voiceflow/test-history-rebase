import { Box, Gauge, Table } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { notEmptyUtterancesCountByIntentIDAtom } from '@/atoms/utterance.atom';
import { getIntentConfidenceLevel, getIntentConfidenceProgress } from '@/utils/intent.util';

import type { ICMSIntentTableConfidenceCell } from './CMSIntentTableConfidenceCell.interface';

export const CMSIntentTableConfidenceCell: React.FC<ICMSIntentTableConfidenceCell> = ({ intentID }) => {
  const utterancesCount = useAtomValue(notEmptyUtterancesCountByIntentIDAtom)[intentID] ?? 0;

  return (
    <Box gap={12} width="100%" align="center">
      <Box width="48px">
        <Gauge level={getIntentConfidenceLevel(utterancesCount)} progress={getIntentConfidenceProgress(utterancesCount)} />
      </Box>

      <Table.Cell.Text label={getIntentConfidenceLevel(utterancesCount)} overflow />
    </Box>
  );
};
