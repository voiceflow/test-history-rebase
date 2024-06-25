import type { CheckboxTypes } from '@voiceflow/ui';
import { Checkbox, Text } from '@voiceflow/ui';
import React from 'react';

interface MenuCheckboxOptionProps extends CheckboxTypes.Props {
  pl?: number | string;
}

const MenuCheckboxOption: React.FC<MenuCheckboxOptionProps> = ({ children, pl, ...props }) => (
  <Checkbox type={Checkbox.Type.RADIO} isFlat {...props}>
    <Text px={6} pl={pl}>
      {children}
    </Text>
  </Checkbox>
);

export default MenuCheckboxOption;
