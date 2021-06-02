import React from 'react';

import { Container, Prefix, Select } from './components';

const PrefixedVariableSelect = ({ value, onChange, prefix = 'APPLY TO', className = '', fullWidth = true, ...props }) => (
  <Container className={className}>
    <Prefix>{prefix}</Prefix>
    <Select plain value={value} onChange={onChange} {...props} fullWidth={fullWidth} hasIcon={false} />
  </Container>
);

export default PrefixedVariableSelect;
