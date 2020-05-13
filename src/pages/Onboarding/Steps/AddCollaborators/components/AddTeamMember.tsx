import React from 'react';

import InvalidEmailError from '@/components/InvalidEmailError';
import { UserRole } from '@/constants';
import { CollaboratorType } from '@/pages/Onboarding/types';
import { isValidEmail, isValueDuplicate } from '@/utils/emails';

import CollaboratorListContainer from './CollaboratorListContainer';
import DropdownInput from './DropdownInput';

const OPTIONS: { value: UserRole; label: string }[] = [
  { value: UserRole.VIEWER, label: 'Can View' },
  { value: UserRole.EDITOR, label: 'Can Edit' },
];

export type AddTeamMembersProps = {
  onUpdate: (value: CollaboratorType[]) => void;
  collaborators: CollaboratorType[];
  errorIndexes: number[];
  updateErrorIndexes: (indxes: number[]) => void;
};

const AddTeamMember: React.FC<AddTeamMembersProps> = ({ collaborators, errorIndexes, updateErrorIndexes, onUpdate }) => {
  const onAdd = (value: string) => onUpdate([...collaborators, { email: value, permission: UserRole.EDITOR }]);
  const onFocus = (index: number) => () => {
    updateErrorIndexes(errorIndexes.filter((idx: number) => idx !== index));
  };
  const onBlur = (index: number, hasError: boolean) => () => {
    if (hasError) {
      updateErrorIndexes([...errorIndexes, index]);
    } else {
      const newErrorIndexs = errorIndexes.filter((idx: number) => idx !== index);
      updateErrorIndexes(newErrorIndexs);
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
