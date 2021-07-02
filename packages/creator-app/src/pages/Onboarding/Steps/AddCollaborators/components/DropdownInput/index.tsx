import React from 'react';

import { InputGroupAddon, TextInputContainer } from '@/components/ButtonDropdownInput/components';
import { OrientationType } from '@/components/ButtonDropdownInput/constants';
import { UserRole } from '@/constants';

import { Container, Input, PermissionsDropdown } from './components';

export type DropdownInputProps = {
  inputValue?: string | null;
  onInputChange: (value: string) => void;
  dropdownValue?: UserRole;
  onDropdownChange?: (value: UserRole) => void;
  options?: { value: UserRole; label: string }[];
  removeCollaborator?: () => void;
  showDropdown?: boolean;
  onBlur?: (email: string) => void;
  autoFocus?: boolean;
  onFocus?: () => void;
  hasError?: boolean;
};

const DropdownInput: React.FC<DropdownInputProps> = ({
  inputValue,
  onInputChange,
  dropdownValue = UserRole.EDITOR,
  onDropdownChange,
  removeCollaborator,
  options,
  showDropdown,
  hasError,
  autoFocus,
  ...props
}) => (
  <Container isInvalid={!!hasError}>
    <TextInputContainer>
      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        orientation={OrientationType.LEFT}
        value={inputValue}
        placeholder="name@example.com"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
        showdropdown={showDropdown}
        error={hasError}
        {...props}
      />
    </TextInputContainer>
    {showDropdown && (
      <InputGroupAddon orientation={OrientationType.LEFT} addonType="prepend">
        <PermissionsDropdown
          orientation={OrientationType.LEFT}
          options={options}
          onSelect={onDropdownChange}
          onRemove={removeCollaborator}
          selectedValue={dropdownValue}
          hasError={hasError}
        />
      </InputGroupAddon>
    )}
  </Container>
);

export default DropdownInput;
