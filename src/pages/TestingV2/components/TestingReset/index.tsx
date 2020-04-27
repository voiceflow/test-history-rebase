import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Section from '@/components/Section';
import { ClickableText } from '@/components/Text';

export type TestingResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
};

const TestingReset: React.FC<TestingResetProps> = ({ onClick }) => (
  <Section>
    <FlexCenter>
      <ClickableText onClick={onClick}>Reset Test</ClickableText>
    </FlexCenter>
  </Section>
);

export default TestingReset;
