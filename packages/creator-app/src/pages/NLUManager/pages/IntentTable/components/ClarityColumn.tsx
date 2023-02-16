import { Box, StrengthGauge, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUIntent } from '@/pages/NLUManager/types';

const ClarityColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item: { clarityLevel } }) =>
  clarityLevel === StrengthGauge.Level.LOADING ? (
    <StrengthGauge width={40} level={clarityLevel} />
  ) : (
    <>
      <Box display="inline-block" mr={12} mt={1}>
        <StrengthGauge width={40} level={clarityLevel} />
      </Box>
      <span>{StrengthGauge.TOOLTIP_LABEL_MAP[clarityLevel].toLowerCase()}</span>
    </>
  );

export default ClarityColumn;
