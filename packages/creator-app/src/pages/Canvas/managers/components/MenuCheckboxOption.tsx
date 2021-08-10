import { Text } from '@voiceflow/ui';
import React from 'react';

import Checkbox, { CheckboxProps, CheckboxType } from '@/components/Checkbox';

export { CheckboxType } from '@/components/Checkbox';

const MenuCheckboxOption: React.FC<CheckboxProps> = ({ children, ...props }) => (
  <Checkbox type={CheckboxType.RADIO} isFlat {...props}>
    <Text px={6}>{children}</Text>
  </Checkbox>
);
export default MenuCheckboxOption;
