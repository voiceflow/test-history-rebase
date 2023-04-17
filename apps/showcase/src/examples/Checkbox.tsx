import { Checkbox, Flex } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const examples = [Checkbox.Type.CHECKBOX, Checkbox.Type.DASH, Checkbox.Type.RADIO].map((variant) =>
  createExample(variant, () => (
    <Flex column gap={16}>
      <Checkbox type={variant} />
      <Checkbox type={variant} checked />
      <Checkbox type={variant}>With label</Checkbox>
      <Checkbox type={variant} checked>
        With label checked
      </Checkbox>
    </Flex>
  ))
);

export default createSection('Checkbox', 'src/components/Checkbox/index.tsx', examples);
