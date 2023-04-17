import { Dropdown, Menu, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { LIST_ORDER_LABELS, LIST_ORDER_OPTIONS, ListOrder } from '@/pages/NLUManager/pages/UnclassifiedData/constants';

import * as S from './styles';

const TableOrderDropdown: React.FC = () => {
  const nluManager = useNLUManager();

  const handleSelect = (value: ListOrder | null) => {
    nluManager.unclassifiedSetListOrder(value || ListOrder.NEWEST);
  };

  return (
    <S.DropdownContainer>
      <Dropdown
        options={LIST_ORDER_OPTIONS}
        menu={(onToggle) => (
          <Menu
            options={LIST_ORDER_OPTIONS}
            onToggle={onToggle}
            onSelect={(value: ListOrder | null) => {
              handleSelect(value);
              onToggle();
            }}
          />
        )}
        offset={{ offset: [0, 6] }}
        placement="top"
        selfDismiss
      >
        {({ ref, onToggle, isOpen }) => (
          <S.DropdownLabel ref={ref} onClick={onToggle}>
            <Text fontSize={13} color="#132144">
              {LIST_ORDER_LABELS[nluManager.unclassifiedListOrder]}
            </Text>
            <SvgIcon size={8} icon="arrowRightSmall" rotation={90} active={isOpen} variant={SvgIcon.Variant.STANDARD} clickable />
          </S.DropdownLabel>
        )}
      </Dropdown>
    </S.DropdownContainer>
  );
};

export default TableOrderDropdown;
