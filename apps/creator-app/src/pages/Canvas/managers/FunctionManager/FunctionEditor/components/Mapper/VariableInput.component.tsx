import { Markup } from '@voiceflow/dtos';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

import { mapperInputStyles } from '../../Function.css';

interface IVariableInput {
  value: Markup;
  onChange?: (value: Markup) => void;
  placeholder?: string;
  maxVariableWidth?: string;
}

export const VariableInput: React.FC<IVariableInput> = ({
  value,
  onChange,
  placeholder = 'Value or {var}',
  maxVariableWidth = '150px',
}) => {
  const variablesMap = useSelector(Designer.selectors.uniqueSlateEntitiesAndVariablesMapByID);

  return (
    <InputWithVariables
      value={value}
      ellipsis
      className={mapperInputStyles}
      singleLine
      placeholder={placeholder}
      inputVariant="ghost"
      variablesMap={variablesMap}
      onValueChange={(value) => onChange?.(value)}
      resetBaseStyles
      maxVariableWidth={maxVariableWidth}
    />
  );
};
