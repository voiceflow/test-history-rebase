import { Markup } from '@voiceflow/dtos';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

import { mapperInputStyles } from '../../Function.css';

interface IVariableInput {
  onChange?: (value: Markup) => void;
  maxVariableWidth?: string;
  description?: string;
  placeholder?: string;
  value: Markup;
}

export const VariableInput: React.FC<IVariableInput> = ({ value, onChange, maxVariableWidth = '150px', placeholder = 'Value or {var}' }) => {
  const variablesMap = useSelector(Designer.selectors.slateVariablesMapByID);

  return (
    <InputWithVariables
      onValueChange={(value) => onChange?.(value)}
      maxVariableWidth={maxVariableWidth}
      className={mapperInputStyles}
      variablesMap={variablesMap}
      placeholder={placeholder}
      variant="ghost"
      value={value}
      resetBaseStyles
      ellipsis
    />
  );
};
