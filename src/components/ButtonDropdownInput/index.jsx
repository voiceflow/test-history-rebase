import React from 'react';
import { InputGroup } from 'reactstrap';

import Icon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import { styled } from '@/hocs';

import DropdownButton from './components/DropdownButton';
import InputGroupAddon from './components/InputGroupAddon';
import TextInput from './components/TextInput';
import TextInputContainer from './components/TextInputContainer';

const Container = styled(InputGroup)`
  position: relative;
  flex-wrap: nowrap;

  & ${DropdownButton}, ${TextInput} {
    transition: border-color 0.15s ease;
  }

  :focus-within {
    & ${DropdownButton}, ${TextInput} {
      border-color: #5d9df5 !important;
    }

    & ${TextInput} {
      border-left: 0 !important;
    }
  }
`;

function RequestTypeStep({ placeholder, dropdownValue, textValue, onDropdownChange, options, onTextChange }) {
  return (
    <Container>
      <InputGroupAddon addonType="prepend">
        <Dropdown options={options} onSelect={onDropdownChange}>
          {(ref, onToggle, isOpen) => (
            <DropdownButton ref={ref} onClick={onToggle} active={isOpen}>
              {dropdownValue.label} <Icon icon="toggle" size={6} />
            </DropdownButton>
          )}
        </Dropdown>
      </InputGroupAddon>
      <TextInputContainer>
        <TextInput notLazy value={textValue} placeholder={placeholder} onChange={onTextChange} />
      </TextInputContainer>
    </Container>
  );
}

export default RequestTypeStep;
