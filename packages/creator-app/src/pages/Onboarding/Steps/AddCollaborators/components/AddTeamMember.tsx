import { UserRole } from '@voiceflow/internal';
import { ClickableText, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import InvalidEmailError from '@/components/InvalidEmailError';
import { CollaboratorType } from '@/pages/Onboarding/types';

import CollaboratorListContainer from './CollaboratorListContainer';
import DropdownInput from './DropdownInput';

const OPTIONS: { value: UserRole; label: string }[] = [
  { value: UserRole.VIEWER, label: 'Can View' },
  { value: UserRole.EDITOR, label: 'Can Edit' },
];

export interface AddTeamMembersProps {
  errors: string[];
  onUpdate: (value: CollaboratorType[]) => void;
  collaborators: CollaboratorType[];
}

const AddTeamMember: React.FC<AddTeamMembersProps> = ({ errors, collaborators, onUpdate }) => {
  const [focusedIndex, setFocusedIndex] = React.useState<null | number>(null);

  const onRemoveCollaborator = (index: number) => () => {
    onUpdate(collaborators.filter((collaborator, idx) => idx !== index && collaborator));
  };

  const onPermissionChange = (index: number) => (permission: UserRole) =>
    onUpdate(collaborators.map((collaborator, idx) => (idx === index ? { ...collaborator, permission } : collaborator)));

  const onEmailChange = (index: number) => (value: string) => {
    const list = collaborators.map((collaborator, idx) => (idx === index ? { ...collaborator, email: value } : collaborator));

    onUpdate(list);
  };

  const onAdd = () => {
    onUpdate([...collaborators, { email: '', permission: UserRole.EDITOR }]);
  };

  return (
    <>
      {!!collaborators.length &&
        collaborators.map((collaborator, index) => {
          const error = focusedIndex === index ? null : errors[index];

          return collaborator.permission === UserRole.ADMIN ? null : (
            <div key={index}>
              <CollaboratorListContainer hasError={!!error}>
                <DropdownInput
                  onBlur={() => setFocusedIndex(null)}
                  options={OPTIONS}
                  onFocus={() => setFocusedIndex(index)}
                  inputValue={collaborator.email}
                  showDropdown={!!collaborator.email}
                  onInputChange={onEmailChange(index)}
                  dropdownValue={collaborator?.permission}
                  onDropdownChange={onPermissionChange(index)}
                  removeCollaborator={onRemoveCollaborator(index)}
                />
              </CollaboratorListContainer>

              {!!error && <InvalidEmailError>{error}</InvalidEmailError>}
            </div>
          );
        })}

      <ClickableText onClick={onAdd}>
        <SvgIcon icon="outlinedAdd" size={14} inline mr={8} mb={-1} />
        Add another
      </ClickableText>
    </>
  );
};

export default AddTeamMember;
