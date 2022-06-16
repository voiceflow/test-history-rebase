import { Box, TableTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { VariableType } from '@/constants';
import { OrderedVariable } from '@/hooks';

import { SelectColumn } from '../../../components';

const VariableSelectColumn: React.FC<TableTypes.ItemProps<OrderedVariable>> = (props) => {
  const isBuiltIn = props.item.type === VariableType.BUILT_IN;

  return isBuiltIn ? (
    <TippyTooltip title="Built-in variables cannot be deleted" style={{ cursor: 'disabled' }} bodyOverflow>
      <Box opacity={0.5} style={{ pointerEvents: 'none' }}>
        <SelectColumn {...props} />
      </Box>
    </TippyTooltip>
  ) : (
    <SelectColumn {...props} />
  );
};

export default VariableSelectColumn;
