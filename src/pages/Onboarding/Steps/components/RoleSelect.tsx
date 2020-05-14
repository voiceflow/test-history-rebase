import React from 'react';

import Select from '@/components/Select';

const SelectComponent: any = Select;

const ROLE_OPTIONS = [
  'Conversation Designer',
  'UI / UX Designer',
  'Content Writer',
  'Project Manager',
  'Developer',
  'Marketing',
  'Sales',
  'VP / Manager',
];

type RoleSelectProps = {
  userRole?: string;
  setUserRole: (role: string) => void;
};

const RoleSelect: React.FC<RoleSelectProps> = ({ userRole, setUserRole }) => {
  return (
    <SelectComponent
      value={userRole}
      options={ROLE_OPTIONS}
      placeholder="Select your role"
      onSelect={setUserRole}
      creatable
      createInputPlaceholder="Add new role"
      onCreate={(role: string) => {
        setUserRole(role);
      }}
      dropdownActive
      withSearchIcon={false}
    />
  );
};

export default RoleSelect;
