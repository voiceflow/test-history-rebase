import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, StrengthGauge, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';

const ClarityColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = ({ item }) => {
  const isBuiltIn = isBuiltInIntent(item.id);

  const strength = isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(item.inputs.length);

  return (
    <>
      <Box display="inline-block" mr={12} mt={1}>
        <StrengthGauge width={40} level={strength} />
      </Box>

      <span>{StrengthGauge.TOOLTIP_LABEL_MAP[strength].toLowerCase()}</span>
    </>
  );
};

export default ClarityColumn;
