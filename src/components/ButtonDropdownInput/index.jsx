import React from 'react';
import { InputGroup } from 'reactstrap';

import Icon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import { SectionToggleVariant } from '@/componentsV2/Section';
import { css, styled } from '@/hocs';

import DropdownButton from './components/DropdownButton';
import InputGroupAddon from './components/InputGroupAddon';
import TextInput from './components/TextInput';
import TextInputContainer from './components/TextInputContainer';
import { OrientationType } from './constants';

export * from './constants';

const Container = styled(InputGroup)`
  position: relative;
  flex-wrap: nowrap;
  flex: 1;

  & ${DropdownButton}, ${TextInput} {
    transition: border-color 0.15s ease;
  }

  :focus-within {
    & ${DropdownButton}, ${TextInput} {
      border-color: #5d9df5 !important;
    }

    & ${TextInput} {
      ${({ orientation }) =>
        orientation === OrientationType.RIGHT
          ? css`
              border-left: 0 !important;
            `
          : css`
              border-right: 0 !important;
            `}
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
}) {
  const Input = (
    <TextInputContainer>
      <TextInput orientation={orientation} value={textValue} placeholder={placeholder} onChange={(e) => onTextChange(e.target.value)} />
    </TextInputContainer>
  );

  return (
    <Container orientation={orientation}>
      {orientation === OrientationType.LEFT && Input}
      <InputGroupAddon orientation={orientation} addonType="prepend">
        <Dropdown options={options} onSelect={onDropdownChange} noScroll={noScroll}>
          {(ref, onToggle, isOpen) => (
            <DropdownButton orientation={orientation} ref={ref} onClick={onToggle} active={isOpen}>
              {dropdownValue.label} <Icon icon={SectionToggleVariant.TOGGLE} size={7} />
            </DropdownButton>
          )}
        </Dropdown>
      </InputGroupAddon>
      {orientation === OrientationType.RIGHT && Input}
    </Container>
  );
}

export default ButtonDropdownInput;
