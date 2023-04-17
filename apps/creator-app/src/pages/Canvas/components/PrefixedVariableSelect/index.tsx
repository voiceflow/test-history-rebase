import React from 'react';

import { VariableSelectProps } from '@/components/VariableSelect';

import { Container, Prefix, Select } from './components';

interface PrefixedVariableSelectProps extends Omit<VariableSelectProps, 'hasIcon'> {
  prefix?: React.ReactNode;
}

const PrefixedVariableSelect: React.FC<PrefixedVariableSelectProps> = ({
  value,
  prefix = 'APPLY TO',
  onChange,
  className = '',
  fullWidth = true,
  ...props
}) => (
  <Container className={className}>
    <Prefix>{prefix}</Prefix>

    <Select value={value} onChange={onChange} {...props} fullWidth={fullWidth} />
  </Container>
);

export default PrefixedVariableSelect;
