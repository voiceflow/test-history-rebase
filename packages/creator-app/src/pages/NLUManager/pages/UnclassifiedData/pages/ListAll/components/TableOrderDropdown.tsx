import { Box, Select, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { ListOrder } from '../../../constants';
import { LIST_ORDER_LABELS, LIST_ORDER_OPTIONS } from '../constants';

const TableOrderDropdown: React.FC = () => {
  const nluManager = useNLUManager();

  return (
    <Box width="100px">
      <Select
        value={nluManager.unclassifiedListOrder}
        fullWidth
        options={LIST_ORDER_OPTIONS}
        onSelect={(value) => {
          if (!value) {
            nluManager.unclassifiedSetListOrder(ListOrder.NEWEST);
          } else {
            nluManager.unclassifiedSetListOrder(value);
          }
        }}
        renderTrigger={({ isOpen }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text fontSize={13} color={isOpen ? '#3D82E2' : '#132144'}>
              {LIST_ORDER_LABELS[nluManager.unclassifiedListOrder]}
            </Text>
            <SvgIcon size={8} icon="caretDown" color={isOpen ? '#3D82E2' : '#6E849A'} />
          </div>
        )}
        renderOptionLabel={(option) => <div>{option && LIST_ORDER_LABELS[option.value]}</div>}
        clearable={false}
        searchable={false}
        getOptionKey={(option) => option.value}
        getOptionLabel={(option) => option && LIST_ORDER_LABELS[option]}
        grouped={false}
        getOptionValue={(option) => option?.value}
        width="100px"
      />
    </Box>
  );
};

export default TableOrderDropdown;
