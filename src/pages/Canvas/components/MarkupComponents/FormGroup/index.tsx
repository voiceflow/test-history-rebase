import React from 'react';

import Flex from '@/components/Flex';

import { Container, LeftColumn } from './components';

export type FormGroupProps = {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
};

const FormGroup: React.FC<FormGroupProps> = ({ leftColumn, rightColumn }) => (
  <Container>
    <LeftColumn>{leftColumn}</LeftColumn>
    <Flex>{rightColumn}</Flex>
  </Container>
);

export default FormGroup;
