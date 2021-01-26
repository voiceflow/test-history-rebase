import React from 'react';

import { Container, Prefix, SelectInput } from './components';

const PrefixedSelect = ({ prefix, offset, className, fullWidth = true, ...props }) => (
  <Container className={className}>
    <Prefix>{prefix}</Prefix>
    <SelectInput plain {...props} fullWidth={fullWidth} hasIcon={false} offset={offset} />
  </Container>
);

export default PrefixedSelect;
