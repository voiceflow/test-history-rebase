import React from 'react';

import { stringify } from '@/utils/functional';

import { Button, Container } from './components';

const ButtonGroup = ({ options, selected, onChange }) => (
  <Container>
    {options.map(({ value, label }, index) => (
      <Button isSelected={value === selected} onClick={() => onChange(value, index)} key={value}>
        {label || stringify(value)}
      </Button>
    ))}
  </Container>
);

export default ButtonGroup;
