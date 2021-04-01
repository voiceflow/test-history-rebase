import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import { Flex } from '@/components/Box';
import Dropdown from '@/components/Dropdown';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';

import ConditionLabelContainer from './ConditionLabelContainer';

export type ConditionLabelProps = {
  actionable?: boolean;
  onChange?: (value: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => void;
};

const ConditionLabel: React.FC<ConditionLabelProps> = ({ actionable = false, onChange, children }) =>
  actionable ? (
    <Dropdown
      menu={() => (
        <Menu>
          <MenuItem onClick={() => onChange?.(ExpressionTypeV2.AND)}>AND</MenuItem>
          <MenuItem onClick={() => onChange?.(ExpressionTypeV2.OR)}>OR</MenuItem>
        </Menu>
      )}
    >
      {(ref, onToggle, isOpen) => (
        <ConditionLabelContainer ref={ref} onClick={onToggle} isOpen={isOpen} secondary>
          {children}
          <Flex ml={8} zIndex={2}>
            <SvgIcon icon="caretDown" size={10} />
          </Flex>
        </ConditionLabelContainer>
      )}
    </Dropdown>
  ) : (
    <ConditionLabelContainer>{children}</ConditionLabelContainer>
  );

export default ConditionLabel;
