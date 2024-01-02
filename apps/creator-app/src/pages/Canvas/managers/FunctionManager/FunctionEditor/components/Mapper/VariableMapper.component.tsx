import { Markup } from '@voiceflow/dtos';
import { Box, FocusIndicator, Mapper } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

import { focusModifier, mapperInputStyles, mapperModifier } from '../../Function.css';
import { ItemWithDescriptionTooltip } from './ItemWithDescriptionTooltip.component';

interface IVariableMapper {
  rightHandInput: React.ReactNode;
  leftHandInput: React.ReactNode;
  description?: string;
  isError?: boolean;
}

export const VariableMapper: React.FC<IVariableMapper> = ({ leftHandInput, rightHandInput, description, isError }) => {
  return (
    <Box height="36px" align="center">
      <FocusIndicator.Container pl={24} error={isError} className={focusModifier}>
        <Mapper
          equalityIcon="arrow"
          leftHandSide={<ItemWithDescriptionTooltip description={description}>{leftHandInput}</ItemWithDescriptionTooltip>}
          rightHandSide={<ItemWithDescriptionTooltip description={description}>{rightHandInput}</ItemWithDescriptionTooltip>}
          className={mapperModifier}
        />
      </FocusIndicator.Container>
    </Box>
  );
};

interface IEditableSlateInput {
  value: Markup;
  onChange: (value: Markup) => void;
  description?: string;
  placeholder?: string;
}

export const EditableSlateInput: React.FC<IEditableSlateInput> = ({ value, onChange }) => {
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
