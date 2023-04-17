import { BaseNode } from '@voiceflow/base-types';
import { Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from '../styles';

export interface ConditionBuilderSelectProps {
  onAddComponent: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  topLevel?: boolean;
}

const ConditionBuilderSelect: React.FC<ConditionBuilderSelectProps> = ({ onAddComponent, topLevel = false }) => {
  const onSelect = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => () => onAddComponent(logicInterface);

  return (
    <Dropdown
      menu={() => (
        <Menu>
          <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VARIABLE)}>Condition</Menu.Item>
          <Menu.Item onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP)}>Logic group</Menu.Item>
        </Menu>
      )}
    >
      {({ ref, onToggle }) => (
        <S.BuilderButton ref={ref} onClick={onToggle} onKeyDown={onToggle} role="button" tabIndex={0} topLevel={topLevel}>
          <SvgIcon icon="plus" size={16} color="#6e849a" />
        </S.BuilderButton>
      )}
    </Dropdown>
  );
};

export default ConditionBuilderSelect;
