import { Utils } from '@voiceflow/common';
import { System } from '@voiceflow/ui';
import React from 'react';

import type { Variable } from '@/models';

import { ControlledVariableInput } from '../VariableInput';
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
          <ControlledVariableInput
            name={name}
            value={value?.toString() || ''}
            onBlur={(text) => handleChange({ name, value: text }, index)}
            disabled={disabled}
          />

          {canDelete && (
            <System.IconButtonsGroup.Base>
              <System.IconButton.Base icon="minus" onClick={() => handleDelete(index)} />
            </System.IconButtonsGroup.Base>
          )}
        </li>
      ))}
    </Container>
  );
};

export default VariableList;
