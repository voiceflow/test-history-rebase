import { BaseNode } from '@voiceflow/base-types';
import { Box, Dropdown, Menu, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import ConditionLabelContainer from './ConditionLabelContainer';

export interface ConditionLabelProps extends React.PropsWithChildren {
  actionable?: boolean;
  onChange?: (value: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => void;
}

const ConditionLabel: React.FC<ConditionLabelProps> = ({ actionable = false, onChange, children }) =>
  actionable ? (
    <Dropdown
      menu={() => (
        <Menu>
          <Menu.Item onClick={() => onChange?.(BaseNode.Utils.ExpressionTypeV2.AND)}>And</Menu.Item>
          <Menu.Item onClick={() => onChange?.(BaseNode.Utils.ExpressionTypeV2.OR)}>Or</Menu.Item>
        </Menu>
      )}
    >
      {({ ref, onToggle, isOpen }) => (
        <ConditionLabelContainer hasCaret ref={ref} onClick={onToggle} isOpen={isOpen} secondary>
          {children}
          <Box.Flex ml={6} zIndex={2}>
            <SvgIcon icon="caretDown" size={8} />
          </Box.Flex>
        </ConditionLabelContainer>
      )}
    </Dropdown>
  ) : (
    <ConditionLabelContainer>{children}</ConditionLabelContainer>
  );

export default ConditionLabel;
