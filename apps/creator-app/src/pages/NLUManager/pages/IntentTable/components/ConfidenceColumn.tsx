import { Box, StrengthGauge, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUIntent } from '@/pages/NLUManager/types';

const ConfidenceColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const strength = item.confidenceLevel;

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
