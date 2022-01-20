import React from 'react';

import { Variable } from '@/models';

import VariableInput from '../VariableInput';
import { Container } from './components';

export interface VariableListProps {
  variables: Variable[];
  onChange: (variable: { name: string; value: string }) => void;
}

const VariableList: React.FC<VariableListProps> = ({ variables, onChange }) => (
  <Container>
    {variables.map(({ name, value }) => (
      <li key={name}>
        <VariableInput name={name} value={value ? value.toString() : ''} onChange={(text) => onChange({ name, value: text })} />
      </li>
    ))}
  </Container>
);

export default VariableList;
