import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, StrengthGauge, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';

const ConfidenceColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = ({ item }) => {
  const isBuiltIn = isBuiltInIntent(item.id);

  const strength = isBuiltIn ? StrengthGauge.Level.VERY_STRONG : getIntentStrengthLevel(item.inputs.length);

  return (
    <>
      <Box display="inline-block" mt={1} mr={12}>
        <StrengthGauge tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'Empty' }} width={40} level={strength} />
      </Box>

      <span>{(strength === StrengthGauge.Level.NOT_SET ? 'Empty' : StrengthGauge.TOOLTIP_LABEL_MAP[strength]).toLowerCase()}</span>
    </>
  );
};

export default ConfidenceColumn;
