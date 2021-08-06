import { Dropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';
import { SectionToggleVariant } from '@/components/Section';
import { styled } from '@/hocs';

import { DropdownButton, TextInput, TextInputContainer } from './components';
import { OrientationType } from './constants';

export * from './constants';
export const Container = styled(InputGroup)`
  & .prepend {
    margin-right: -2px;
  }
  & .append {
    margin-left: -2px;
  }
  & ${DropdownButton}, ${TextInput} {
    transition: border-color 0.15s ease;
  }
  :focus-within {
    & ${DropdownButton}, ${TextInput} {
      border-color: #5d9df5 !important;
    }
  }
`;

function ButtonDropdownInput({
  placeholder,
  dropdownValue,
  textValue,
  onDropdownChange,
  options,
  onTextChange,
  noScroll = false,
  orientation = OrientationType.RIGHT,
  error,
  onFocus,
}) {
  const Input = (
    <TextInputContainer>
      <TextInput
        orientation={orientation}
        value={textValue}
        onFocus={onFocus}
        placeholder={placeholder}
        onChange={(e) => onTextChange(e.target.value)}
        error={error}
      />
    </TextInputContainer>
  );

  return (
    <Container>
      {orientation === OrientationType.LEFT && Input}
      <InputGroupAddon addonType={orientation === OrientationType.RIGHT ? AddonType.PREPEND : AddonType.APPEND}>
        <Dropdown options={options} onSelect={onDropdownChange} noScroll={noScroll}>
          {(ref, onToggle, isOpen) => (
            <DropdownButton orientation={orientation} ref={ref} onClick={onToggle} active={isOpen} error={error} disabled={error}>
              {dropdownValue.label}
              <SvgIcon icon={SectionToggleVariant.TOGGLE} size={7} />
            </DropdownButton>
          )}
        </Dropdown>
      </InputGroupAddon>
      {orientation === OrientationType.RIGHT && Input}
    </Container>
  );
}

export default ButtonDropdownInput;
