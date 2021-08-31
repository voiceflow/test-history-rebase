import { SelectProps } from '@voiceflow/ui';
import React from 'react';

import { Container, Prefix, SelectInput } from './components';

export type PrefixedSelectProps<O, V> = SelectProps<O, V> & {
  offset?: number;
};

const PrefixedSelect = <O, V>({ prefix, offset, className, fullWidth = true, ...props }: PrefixedSelectProps<O, V>): React.ReactElement<any, any> => (
  <Container className={className}>
    <Prefix>{prefix}</Prefix>
    <SelectInput {...props} fullWidth={fullWidth} offset={offset} />
  </Container>
);

export default PrefixedSelect;
