import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, Menu, MenuItem, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import AddConditionButton from './AddConditionButton';

export interface ConditionSelectProps {
  additional?: boolean;
  isLogicGroup?: boolean;
  expression?: Realtime.ExpressionV2;
  onChange: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  isV2?: boolean;
}

const ConditionSelect: React.FC<ConditionSelectProps> = ({ onChange, additional = false, isLogicGroup = false, isV2 = false }) => {
  const onSelect = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => () => onChange(logicInterface);

  return (
    <Dropdown
      menu={() => (
        <Menu>
          <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VARIABLE)}>Variable</MenuItem>
          <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VALUE)}>
            <Text mr={6}>Value</Text>
            <Text fontSize={14} color="#62778c">
              (plain text)
            </Text>
          </MenuItem>
          {!isLogicGroup && (
            <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP)}>
              <Text mr={6}>Logic group</Text>
              <Text fontSize={14} color="#62778c">
                (and, or)
              </Text>
            </MenuItem>
          )}
          {!(additional || isLogicGroup) && <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.EXPRESSION)}>Expression</MenuItem>}
        </Menu>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <AddConditionButton isOpen={isOpen} ref={ref} onClick={onToggle} additional={additional}>
          {isV2 ? <SvgIcon icon="plus" size={16} color="#6e849a" /> : <div>Add a condition</div>}
        </AddConditionButton>
      )}
    </Dropdown>
  );
};

export default ConditionSelect;
