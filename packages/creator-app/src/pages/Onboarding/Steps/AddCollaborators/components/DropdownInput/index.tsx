import { UserRole } from '@voiceflow/internal';
import React from 'react';

import { TextInputContainer } from '@/components/ButtonDropdownInput/components';
import { OrientationType } from '@/components/ButtonDropdownInput/constants';
import InputGroup from '@/components/InputGroup';
import InputGroupAddon, { AddonType } from '@/components/InputGroupAddon';

import { Container, Input, PermissionsDropdown } from './components';

export interface DropdownInputProps {
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
}

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
    <InputGroup>
      <TextInputContainer>
        <Input
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
        <InputGroupAddon addonType={AddonType.PREPEND}>
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
    </InputGroup>
  </Container>
);

export default DropdownInput;
