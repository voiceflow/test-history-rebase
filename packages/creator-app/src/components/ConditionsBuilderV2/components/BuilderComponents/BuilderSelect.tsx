import { BaseNode } from '@voiceflow/base-types';
import { Dropdown, Menu, MenuItem, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import BuilderButton from './BuilderButton';

export interface BuilderSelectProps {
  onAddComponent: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  topLevel?: boolean;
}

const BuilderSelect: React.FC<BuilderSelectProps> = ({ onAddComponent, topLevel = false }) => {
  const onSelect = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => () => onAddComponent(logicInterface);

  return (
    <Dropdown
      menu={() => (
        <Menu>
          <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.VARIABLE)}>Condition</MenuItem>
          <MenuItem onClick={onSelect(BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP)}>Logic group</MenuItem>
        </Menu>
      )}
    >
      {(ref, onToggle) => (
        <BuilderButton ref={ref} onClick={onToggle} onKeyDown={onToggle} role="button" tabIndex={0} topLevel={topLevel}>
          <SvgIcon icon="plus" size={16} color="#6e849a" />
        </BuilderButton>
      )}
    </Dropdown>
  );
};

export default BuilderSelect;
