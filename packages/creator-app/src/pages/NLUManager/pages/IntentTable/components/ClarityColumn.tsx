import { Box, StrengthGauge, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUIntent } from '@/pages/NLUManager/types';

const ClarityColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => {
  const strength = item.clarityLevel;

  return (
    <>
      {strength === 'loading' ? (
        <StrengthGauge.Spinner width={40} />
      ) : (
        <>
          <Box display="inline-block" mr={12} mt={1}>
            <StrengthGauge width={40} level={strength} />
          </Box>
          <span>{StrengthGauge.TOOLTIP_LABEL_MAP[strength].toLowerCase()}</span>
        </>
      )}
    </>
  );
};

export default ClarityColumn;
