import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { ClickableText, createDividerMenuItemOption, Input, isNotUIOnlyMenuItemOption, Select, SvgIcon, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { CollaboratorType } from '@/pages/Onboarding/types';
import { isEditorUserRole } from '@/utils/role';

import { MAX_EDITOR_SEATS } from '../utils';
import CollaboratorListContainer from './CollaboratorListContainer';

type Value = UserRole | 'remove';

interface Option {
  value: UserRole | 'remove';
  label: string;
}

const OPTIONS: Array<UIOnlyMenuItemOption | Option> = [
  { value: UserRole.VIEWER, label: 'Can view' },
  { value: UserRole.EDITOR, label: 'Can edit' },
  createDividerMenuItemOption(),
  { value: 'remove', label: 'Remove' },
];

const OPTIONS_WITHOUT_EDITOR = OPTIONS.filter((option) => option.value !== UserRole.EDITOR);

const OPTIONS_MAP = Utils.array.createMap(OPTIONS.filter(isNotUIOnlyMenuItemOption), (option) => option.value);

export interface AddTeamMembersProps {
  errors: string[];
  onUpdate: (value: CollaboratorType[]) => void;
  collaborators: CollaboratorType[];
}

const AddTeamMember: React.FC<AddTeamMembersProps> = ({ errors, collaborators, onUpdate }) => {
  const [focusedIndex, setFocusedIndex] = React.useState<null | number>(null);

  const onAdd = () => {
    onUpdate([...collaborators, { email: '', permission: collaborators.length >= MAX_EDITOR_SEATS ? UserRole.VIEWER : UserRole.EDITOR }]);
  };

  const hasAvailableSeats = React.useMemo(
    () => collaborators.filter((collaborator) => isEditorUserRole(collaborator.permission)).length < MAX_EDITOR_SEATS,
    [collaborators]
  );

  const onSelectValue = (index: number) => (permission: Value) =>
    onUpdate(
      permission === 'remove'
        ? collaborators.filter((collaborator, idx) => idx !== index && collaborator)
        : collaborators.map((collaborator, idx) => (idx === index ? { ...collaborator, permission } : collaborator))
    );

  const onEmailChange = (index: number) => (value: string) => {
    const list = collaborators.map((collaborator, idx) => (idx === index ? { ...collaborator, email: value } : collaborator));

    onUpdate(list);
  };

  return (
    <>
      {collaborators.map((collaborator, index) => {
        if (collaborator.permission === UserRole.ADMIN) return null;

        const error = focusedIndex === index ? null : errors[index];

        return (
          <div key={index}>
            <CollaboratorListContainer hasError={!!error}>
              <SelectInputGroup
                renderInput={(props) => (
                  <Input
                    {...props}
                    error={!!error}
                    value={collaborator.email}
                    onBlur={() => setFocusedIndex(null)}
                    onFocus={() => setFocusedIndex(index)}
                    placeholder="name@example.com"
                    onChangeText={onEmailChange(index)}
                  />
                )}
              >
                {(props) =>
                  !!collaborator.email && (
                    <Select<Option, Value>
                      {...props}
                      value={collaborator.permission}
                      options={hasAvailableSeats || collaborator.permission === UserRole.EDITOR ? OPTIONS : OPTIONS_WITHOUT_EDITOR}
                      onSelect={onSelectValue(index)}
                      getOptionKey={(option) => option.value}
                      getOptionValue={(option) => option?.value}
                      getOptionLabel={(value) => value && OPTIONS_MAP[value]?.label}
                    />
                  )
                }
              </SelectInputGroup>
            </CollaboratorListContainer>

            {!!error && <InputError>{error}</InputError>}
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
