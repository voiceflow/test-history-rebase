import { Node } from '@voiceflow/base-types';
import { BoxFlex, Dropdown, Menu, MenuItem, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import ConditionLabelContainer from './ConditionLabelContainer';

export interface ConditionLabelProps {
  actionable?: boolean;
  onChange?: (value: Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR) => void;
}

const ConditionLabel: React.FC<ConditionLabelProps> = ({ actionable = false, onChange, children }) =>
  actionable ? (
    <Dropdown
      menu={() => (
        <Menu>
          <MenuItem onClick={() => onChange?.(Node.Utils.ExpressionTypeV2.AND)}>And</MenuItem>
          <MenuItem onClick={() => onChange?.(Node.Utils.ExpressionTypeV2.OR)}>Or</MenuItem>
        </Menu>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <ConditionLabelContainer hasCaret ref={ref} onClick={onToggle} isOpen={isOpen} secondary>
          {children}
          <BoxFlex ml={6} zIndex={2}>
            <SvgIcon icon="caretDown" size={8} />
          </BoxFlex>
        </ConditionLabelContainer>
      )}
    </Dropdown>
  ) : (
    <ConditionLabelContainer>{children}</ConditionLabelContainer>
  );

export default ConditionLabel;
