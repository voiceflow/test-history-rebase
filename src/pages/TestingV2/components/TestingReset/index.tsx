import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Section from '@/components/Section';
import Text from '@/components/Text/ClickableText';

export type TestingResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
};

const TestingReset: React.FC<TestingResetProps> = ({ onClick }) => (
  <Section>
    <FlexCenter>
      <Text onClick={onClick}>Reset Test</Text>
    </FlexCenter>
  </Section>
);

export default TestingReset;
