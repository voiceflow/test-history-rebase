import { Utils } from '@voiceflow/common';
import { IconButton } from '@voiceflow/ui';
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

const VariableList: React.OldFC<VariableListProps> = ({ variables, onChange, onChangeList, canDelete, disabled }) => {
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
          {canDelete && <IconButton icon="minus" onClick={() => handleDelete(index)} variant={IconButton.Variant.BASIC} />}
        </li>
      ))}
    </Container>
  );
};

export default VariableList;
