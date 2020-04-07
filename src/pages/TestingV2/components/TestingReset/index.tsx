import React from 'react';

import { FlexCenter } from '@/components/Flex';
import Section from '@/components/Section';

import { Link } from './components';

export type TestingResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
};

const TestingReset: React.FC<TestingResetProps> = ({ onClick }) => (
  <Section>
    <FlexCenter>
      <Link as="span" onClick={onClick}>
        Reset Test
      </Link>
    </FlexCenter>
  </Section>
);

export default TestingReset;
