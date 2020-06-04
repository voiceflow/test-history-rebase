import React from 'react';

import Flex from '@/components/Flex';

import { Container, LeftColumn } from './components';

export type FormGroupProps = {
  className?: string;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
};

const FormGroup: React.FC<FormGroupProps> = ({ className, leftColumn, rightColumn }) => (
  <Container className={className}>
    <LeftColumn>{leftColumn}</LeftColumn>
    <Flex>{rightColumn}</Flex>
  </Container>
);

export default FormGroup;
