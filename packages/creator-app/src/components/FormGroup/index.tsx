import { Flex } from '@voiceflow/ui';
import React from 'react';

import { Container, LeftColumn } from './components';

export * from './components';

export interface FormGroupProps {
  className?: string;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ className, leftColumn, rightColumn }) => (
  <Container className={className}>
    <LeftColumn>{leftColumn}</LeftColumn>
    <Flex>{rightColumn}</Flex>
  </Container>
);

export default FormGroup;
