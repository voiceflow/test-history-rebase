import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, Menu, Text } from '@voiceflow/ui';
import React from 'react';

import AddConditionButton from './AddConditionButton';

export interface ConditionSelectProps {
  additional?: boolean;
  isLogicGroup?: boolean;
  expression?: Realtime.ExpressionV2;
  onChange: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
}

const ConditionSelect: React.FC<ConditionSelectProps> = ({ onChange, additional = false, isLogicGroup = false }) => {
  const onSelect = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => () => onChange(logicInterface);

  return (
    <Dropdown
      menu={() => (
        <Menu>
          <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VARIABLE)}>Variable</Menu.Item>
          <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VALUE)}>
            <Text mr={6}>Value</Text>
            <Text fontSize={14} color="#62778c">
              (plain text)
            </Text>
          </Menu.Item>
          {!isLogicGroup && (
            <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP)}>
              <Text mr={6}>Logic group</Text>
              <Text fontSize={14} color="#62778c">
                (and, or)
              </Text>
            </Menu.Item>
          )}
          {!(additional || isLogicGroup) && (
            <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.EXPRESSION)}>Expression</Menu.Item>
          )}
        </Menu>
      )}
    >
      {({ ref, onToggle, isOpen }) => (
        <AddConditionButton isOpen={isOpen} ref={ref} onClick={onToggle} additional={additional}>
          <div>Add a condition</div>
        </AddConditionButton>
      )}
    </Dropdown>
  );
};

export default ConditionSelect;
