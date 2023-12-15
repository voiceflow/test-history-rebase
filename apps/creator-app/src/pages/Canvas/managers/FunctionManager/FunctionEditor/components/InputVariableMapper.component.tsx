import { Markup } from '@voiceflow/dtos';
import { Box, FocusIndicator, Mapper, Text, Tokens, Tooltip, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';

import { focusModifier, mapperInputStyles, mapperModifier } from '../Function.css';

interface IVariableMapper {
  leftHandInput: React.ReactNode;
  rightHandInput: React.ReactNode;
  description?: string;
  isError?: boolean;
}

const TOOLTIP_OFFSET_FOR_32_PX_ARROW_DROP = 41.5;

export const VariableMapper: React.FC<IVariableMapper> = ({ leftHandInput, rightHandInput, description, isError }) => {
  return (
    <Tooltip
      placement="left"
      width={247}
      modifiers={[{ name: 'offset', options: { offset: [TOOLTIP_OFFSET_FOR_32_PX_ARROW_DROP, 3] } }]}
      referenceElement={({ ref, onOpen, onClose }) => (
        <Box height="36px" align="center">
          <FocusIndicator.Container focusIndicatorRef={ref} pl={24} error={isError} className={focusModifier}>
            <Mapper
              equalityIcon="arrow"
              leftHandSide={<div onFocus={description ? onOpen : undefined}>{leftHandInput}</div>}
              rightHandSide={
                <div onFocus={onOpen} onBlur={onClose}>
                  {rightHandInput}
                </div>
              }
              className={mapperModifier}
            />
          </FocusIndicator.Container>
        </Box>
      )}
    >
      {() => <TooltipContent description={description} />}
    </Tooltip>
  );
};

interface IEditableSlateInput {
  value: Markup;
  onChange: (value: Markup) => void;
  description?: string;
  placeholder?: string;
}

export const EditableSlateInput: React.FC<IEditableSlateInput> = ({ value, onChange }) => {
  return (
    <InputWithVariables
      singleLine
      className={mapperInputStyles}
      variant="ghost"
      value={value}
      onValueChange={onChange}
      placeholder="Value or {var}"
      canCreateVariables
    />
  );
};

interface IReadOnlySlateInput {
  value: string;
  description?: string;
  placeholder?: string;
}

export const ReadOnlySlateInput: React.FC<IReadOnlySlateInput> = ({ value, description }) => {
  return (
    <Tooltip
      placement="left"
      width={247}
      isOpen={false}
      modifiers={[{ name: 'offset', options: { offset: [TOOLTIP_OFFSET_FOR_32_PX_ARROW_DROP, 8] } }]}
      referenceElement={({ ref, onOpen, onClose }) => (
        <Box ref={ref} onMouseEnter={description ? onOpen : undefined} onMouseLeave={onClose}>
          <Variable label={value} />
        </Box>
      )}
    >
      {() => <TooltipContent description={description} />}
    </Tooltip>
  );
};

const TooltipContent = ({ description }: { description: string | undefined }) => (
  <Box direction="column" px={8} pt={4} pb={5}>
    <Box mb={4}>
      <Text variant="caption" weight="semiBold" color={Tokens.colors.neutralLight.neutralsLight400}>
        Builder note
      </Text>
    </Box>
    <Text variant="caption">{description}</Text>
  </Box>
);
