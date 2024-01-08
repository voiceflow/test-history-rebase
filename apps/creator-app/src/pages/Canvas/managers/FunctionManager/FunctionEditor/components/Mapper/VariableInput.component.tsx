import { Markup } from '@voiceflow/dtos';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

import { mapperInputStyles } from '../../Function.css';

interface IVariableInput {
  onChange: (value: Markup) => void;
  description?: string;
  placeholder?: string;
  value: Markup;
}

export const VariableInput: React.FC<IVariableInput> = ({ value, onChange }) => {
  const variablesMap = useSelector(Designer.selectors.slateVariablesMapByID);

  return (
    <InputWithVariables
      className={mapperInputStyles}
      placeholder="Value or {var}"
      variablesMap={variablesMap}
      onValueChange={onChange}
      variant="ghost"
      value={value}
      singleLine
    />
  );
};
