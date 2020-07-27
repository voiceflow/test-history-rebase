import React from 'react';

import Select from '@/components/Select';

const ROLE_OPTIONS = [
  'Conversation Designer',
  'UI / UX Designer',
  'Content Writer',
  'Project Manager',
  'Developer',
  'Marketing',
  'Sales',
  'VP / Manager',
  'Student',
  'Educator',
];

type RoleSelectProps = {
  userRole?: string;
  setUserRole: (role: string) => void;
};

const RoleSelect: React.FC<RoleSelectProps> = ({ userRole, setUserRole }) => {
  return (
    <Select
      value={userRole}
      options={ROLE_OPTIONS}
      placeholder="Select your role"
      onSelect={setUserRole}
      maxHeight={192}
      creatable
      createInputPlaceholder="Add new role"
      onCreate={(role) => setUserRole(role)}
      withSearchIcon={false}
    />
  );
};

export default RoleSelect;
