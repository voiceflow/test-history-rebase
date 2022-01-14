import React from 'react';

import VariableInput from '../VariableInput';
import { Container } from './components';

export interface VariableListProps {
  variables: { name: string; value: string }[];
}

const VariableList: React.FC<VariableListProps> = ({ variables }) => (
  <Container>
    {variables.map(({ name, value }) => (
      <li key={name}>
        <VariableInput name={name} value={value} onChange={() => {}} />
      </li>
    ))}
  </Container>
);

export default VariableList;
