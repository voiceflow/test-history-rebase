import { Checkbox, CheckboxTypes, Text } from '@voiceflow/ui';
import React from 'react';

const MenuCheckboxOption: React.FC<CheckboxTypes.Props> = ({ children, ...props }) => (
  <Checkbox type={Checkbox.Type.RADIO} isFlat {...props}>
    <Text px={6}>{children}</Text>
  </Checkbox>
);

export default MenuCheckboxOption;
