import { Utils } from '@voiceflow/common';
import { Markup } from '@voiceflow/dtos';
import { ActionButtons, Box, FocusIndicator, Mapper, Menu, MenuItem, Popper, Search, Text, Tokens, Tooltip, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { useDeferredSearch } from '@/hooks/search.hook';

import { focusModifier, mapperInputStyles, mapperModifier, variableSelect } from '../Function.css';

interface IVariableMapper {
  leftHandInput: React.ReactNode;
  rightHandInput: React.ReactNode;
  description?: string;
  isError?: boolean;
}

const TOOLTIP_OFFSET_FOR_32_PX_ARROW_DROP = 30;
const MODIFIERS = [{ name: 'offset', options: { offset: [TOOLTIP_OFFSET_FOR_32_PX_ARROW_DROP, 3] } }];

export const VariableMapper: React.FC<IVariableMapper> = ({ leftHandInput, rightHandInput, description, isError }) => {
  return (
    <Box height="36px" align="center">
      <FocusIndicator.Container pl={24} error={isError} className={focusModifier}>
        <Mapper
          equalityIcon="arrow"
          leftHandSide={
            <Tooltip
              placement="left"
              width={247}
              modifiers={MODIFIERS}
              referenceElement={({ ref, onOpen, onClose }) => {
                const onOpenTrigger = description ? onOpen : undefined;
                return (
                  <div ref={ref} onMouseEnter={onOpenTrigger} onMouseLeave={onClose}>
                    {leftHandInput}
                  </div>
                );
              }}
            >
              {() => <TooltipContent description={description} />}
            </Tooltip>
          }
          rightHandSide={
            <Tooltip
              placement="left"
              width={247}
              modifiers={MODIFIERS}
              referenceElement={({ ref, onOpen, onClose }) => {
                const onOpenTrigger = description ? onOpen : undefined;

                return (
                  <div ref={ref} onFocus={onOpenTrigger} onBlur={onClose}>
                    {rightHandInput}
                  </div>
                );
              }}
            >
              {() => <TooltipContent description={description} />}
            </Tooltip>
          }
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

interface IReadonlyVariable {
  value: string;
  description?: string;
  placeholder?: string;
}

export const ReadOnlySlateInput: React.FC<IReadonlyVariable> = ({ value, description }) => {
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

interface IVariableSelect {
  value: string;
  description?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
}

export const VariableSelect: React.FC<IVariableSelect> = ({ value, onSelect }) => {
  const variablesMap = useSelector(Designer.selectors.slateVariablesMapByID);
  const search = useDeferredSearch({
    items: Object.values(variablesMap),
    searchBy: (item) => item.name,
  });

  return (
    <Popper
      placement="bottom-start"
      referenceElement={({ onOpen, ref, isOpen }) => (
        <Box ref={ref}>
          {value ? (
            <Variable className={variableSelect} label={value} onClick={onOpen} isActive={isOpen} />
          ) : (
            <Text className={variableSelect} onClick={onOpen}>{`Apply to {var}`}</Text>
          )}
        </Box>
      )}
      modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      onClose={() => search.setValue('')}
    >
      {({ onClose }) => (
        <Menu
          width={200}
          maxWidth={256}
          searchSection={<Search value={search.value} onValueChange={search.setValue} placeholder="Search" />}
          actionButtons={
            <ActionButtons firstButton={<ActionButtons.Button label="Remove" onClick={Utils.functional.chain(() => onSelect(''), onClose)} />} />
          }
        >
          {search.items.map(({ name }) => (
            <MenuItem searchValue={search.value} key={name} label={name} onClick={Utils.functional.chain(() => onSelect(name), onClose)} />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
