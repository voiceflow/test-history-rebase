import { Text } from '@voiceflow/ui';
import React from 'react';

import Checkbox, { CheckboxTypes } from '@/components/legacy/Checkbox';

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
