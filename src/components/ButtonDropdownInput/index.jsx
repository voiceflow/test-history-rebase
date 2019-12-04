import React from 'react';
import { InputGroup } from 'reactstrap';

import Icon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import { styled } from '@/hocs';

import DropdownButton from './components/DropdownButton';
import InputGroupAddon from './components/InputGroupAddon';
import TextInput from './components/TextInput';
import TextInputContainer from './components/TextInputContainer';
import VariableTextInput from './components/VariableTextInput';

export const ORIENTATION_TYPE = {
  RIGHT: 'right',
  LEFT: 'left',
};

const Container = styled(InputGroup)`
  position: relative;
  flex-wrap: nowrap;
  flex: 1;

  & ${DropdownButton}, ${VariableTextInput}, ${TextInput} {
    transition: border-color 0.15s ease;
  }

  :focus-within {
    & ${DropdownButton}, ${VariableTextInput}, ${TextInput} {
      border-color: #5d9df5 !important;
    }

    & ${VariableTextInput}, ${TextInput} {
      
      
       & ${({ orientation }) =>
         orientation === ORIENTATION_TYPE.RIGHT
           ? `
            border-left: 0 !important;
              `
           : `
             border-right: 0 !important;
        `}
    }
  }
`;

function RequestTypeStep({
  placeholder,
  dropdownValue,
  textValue,
  onDropdownChange,
  options,
  onTextChange,
  regularInput,
  orientation = ORIENTATION_TYPE.RIGHT,
}) {
  const Input = (
    <TextInputContainer>
      {regularInput ? (
        <TextInput orientation={orientation} value={textValue} placeholder={placeholder} onChange={(e) => onTextChange(e.target.value)} />
      ) : (
        <VariableTextInput orientation={orientation} notLazy value={textValue} placeholder={placeholder} onChange={onTextChange} />
      )}
    </TextInputContainer>
  );

  return (
    <Container orientation={orientation}>
      {orientation === ORIENTATION_TYPE.LEFT && Input}
      <InputGroupAddon orientation={orientation} addonType="prepend">
        <Dropdown options={options} onSelect={onDropdownChange}>
          {(ref, onToggle, isOpen) => (
            <DropdownButton orientation={orientation} ref={ref} onClick={onToggle} active={isOpen}>
              {dropdownValue.label} <Icon icon="toggle" size={7} />
            </DropdownButton>
          )}
        </Dropdown>
      </InputGroupAddon>
      {orientation === ORIENTATION_TYPE.RIGHT && Input}
    </Container>
  );
}

export default RequestTypeStep;
