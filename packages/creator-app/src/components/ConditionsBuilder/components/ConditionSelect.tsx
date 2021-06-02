import { ConditionsLogicInterface } from '@voiceflow/general-types';
import React from 'react';

import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import Text from '@/components/Text';
import { ExpressionV2 } from '@/models';

import AddConditionButton from './AddConditionButton';

export type ConditionSelectProps = {
  additional?: boolean;
  isLogicGroup?: boolean;
  expression?: ExpressionV2;
  onChange: (value: ConditionsLogicInterface) => void;
};

const ConditionSelect: React.FC<ConditionSelectProps> = ({ onChange, additional = false, isLogicGroup = false }) => {
  const onSelect = (logicInterface: ConditionsLogicInterface) => () => onChange(logicInterface);

  return (
    <Dropdown
      menu={() => (
        <Menu>
          <MenuItem onClick={onSelect(ConditionsLogicInterface.VARIABLE)}>Variable</MenuItem>
          <MenuItem onClick={onSelect(ConditionsLogicInterface.VALUE)}>
            <Text mr={6}>Value</Text>
            <Text fontSize={14} color="#62778c">
              (plain text)
            </Text>
          </MenuItem>
          {!isLogicGroup && (
            <MenuItem onClick={onSelect(ConditionsLogicInterface.LOGIC_GROUP)}>
              <Text mr={6}>Logic group</Text>
              <Text fontSize={14} color="#62778c">
                (and, or)
              </Text>
            </MenuItem>
          )}
          {!(additional || isLogicGroup) && <MenuItem onClick={onSelect(ConditionsLogicInterface.EXPRESSION)}>Expresssion</MenuItem>}
        </Menu>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <AddConditionButton isOpen={isOpen} ref={ref} onClick={onToggle} additional={additional}>
          Add a condition
        </AddConditionButton>
      )}
    </Dropdown>
  );
};

export default ConditionSelect;
