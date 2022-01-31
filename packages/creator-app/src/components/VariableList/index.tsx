import { Utils } from '@voiceflow/common';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Variable } from '@/models';

import VariableInput from '../VariableInput';
import { Container } from './components';

export interface VariableListProps {
  variables: Variable[];
  onChange?: (variable: Variable) => void;
  onChangeList?: (variable: Variable[]) => void;
  canDelete?: boolean;
  disabled?: boolean;
}

const VariableList: React.FC<VariableListProps> = ({ variables, onChange, onChangeList, canDelete, disabled }) => {
  const handleChange = (newVar: Variable, index: number) => {
    onChange?.(newVar);
    onChangeList?.(Utils.array.replace(variables, index, newVar));
  };

  const handleDelete = (index: number) => {
    onChangeList?.(Utils.array.without(variables, index));
  };

  return (
    <Container>
      {variables.map(({ name, value }, index) => (
        <li key={name}>
          <VariableInput
            name={name}
            value={value?.toString() || ''}
            onChange={(text) => handleChange({ name, value: text }, index)}
            disabled={disabled}
          />
          {canDelete && <SvgIcon icon="itemMinus" size={16} onClick={() => handleDelete(index)} />}
        </li>
      ))}
    </Container>
  );
};

export default VariableList;
