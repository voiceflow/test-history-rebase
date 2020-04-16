import React from 'react';

import { UserRole } from '@/constants';
import { CollaboratorType } from '@/pages/OnboardingV2/types';

import { isValidEmail, isValueDuplicate } from '../utils';
import { CollaboratorListContainer, DropdownInput, InvalidEmailError } from '.';

const OPTIONS: { value: UserRole; label: string }[] = [
  { value: UserRole.VIEWER, label: 'CAN VIEW' },
  { value: UserRole.EDITOR, label: 'CAN EDIT' },
];

export type AddTeamMembersProps = {
  onUpdate: (value: CollaboratorType[]) => void;
  collaborators: CollaboratorType[];
  enableContinue: () => void;
  disableContinue: () => void;
};

const AddTeamMember: React.FC<AddTeamMembersProps> = ({ collaborators, onUpdate, enableContinue, disableContinue }) => {
  const [errorIndexes, updateErrorIndexes] = React.useState<number[]>([]);

  const onAdd = (value: string) => onUpdate([...collaborators, { email: value }]);
  const onFocus = (index: number) => () => {
    updateErrorIndexes(errorIndexes.filter((idx) => idx !== index));
    enableContinue();
  };
  const onBlur = (index: number, hasError: boolean) => () => {
    if (hasError) {
      updateErrorIndexes([...errorIndexes, index]);
      disableContinue();
    } else {
      updateErrorIndexes(errorIndexes.filter((idx) => idx !== index));
      enableContinue();
    }
  };
  const onRemoveCollaborator = (index: number) => () => onUpdate(collaborators.filter((collaborator, idx) => idx !== index && collaborator));
  const onPermissionChange = (index: number) => (permission: UserRole) =>
    onUpdate(collaborators.map((collaborator, idx) => (idx === index ? { ...collaborator, permission } : collaborator)));
  const onEmailChange = (index: number) => (value: string) => {
    if (value) {
      const list = collaborators
        .map((collaborator, idx) => (idx === index && !!value ? { ...collaborator, email: value } : collaborator))
        .filter((collaborator) => collaborator.email);

      onUpdate(list);
    } else {
      onRemoveCollaborator(index)();
    }
  };

  return (
    <>
      {!!collaborators.length &&
        collaborators.map((collaborator, index) => {
          const isEmailValid = !isValidEmail(collaborator.email);
          const duplicateError = isValueDuplicate(collaborator.email, collaborators, 'email');
          const hasError = (isEmailValid || duplicateError) && errorIndexes.includes(index);

          return (
            <div key={index}>
              <CollaboratorListContainer hasError={hasError}>
                <DropdownInput
                  options={OPTIONS}
                  inputValue={collaborator.email}
                  onInputChange={onEmailChange(index)}
                  onDropdownChange={onPermissionChange(index)}
                  dropdownValue={collaborator?.permission}
                  removeCollaborator={onRemoveCollaborator(index)}
                  showDropdown={isValidEmail(collaborator.email)}
                  onFocus={onFocus(index)}
                  onBlur={onBlur(index, isEmailValid || duplicateError)}
                  hasError={hasError}
                  isDisabled={collaborator.permission === UserRole.ADMIN}
                />
              </CollaboratorListContainer>
              {hasError && <InvalidEmailError>{isEmailValid ? 'Email is not valid.' : 'Duplicate email.'}</InvalidEmailError>}
            </div>
          );
        })}
      <DropdownInput inputValue="" onInputChange={onAdd} />
    </>
  );
};

export default AddTeamMember;
