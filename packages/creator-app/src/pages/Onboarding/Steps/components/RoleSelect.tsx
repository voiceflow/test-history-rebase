import { Select } from '@voiceflow/ui';
import React from 'react';

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

interface RoleSelectProps {
  userRole?: string;
  setUserRole: (role: string) => void;
}

const RoleSelect: React.OldFC<RoleSelectProps> = ({ userRole, setUserRole }) => (
  <Select
    value={userRole}
    options={ROLE_OPTIONS}
    placeholder="Select your role"
    onSelect={setUserRole}
    maxHeight={192}
    creatable
    createInputPlaceholder="Add new role"
    onCreate={(role) => setUserRole(role)}
  />
);

export default RoleSelect;
