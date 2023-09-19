import { Select } from '@voiceflow/ui';
import React from 'react';

const ROLE_OPTIONS = ['Developer', 'Conversation Designer', 'No-Code Builder', 'Business Stakeholder', 'Other'];

interface RoleSelectProps {
  userRole?: string;
  setUserRole: (role: string) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ userRole, setUserRole }) => (
  <Select
    value={userRole}
    options={ROLE_OPTIONS}
    placeholder="Select your main role"
    onSelect={setUserRole}
    creatable
    createInputPlaceholder="Add new role"
    onCreate={(role) => setUserRole(role)}
  />
);

export default RoleSelect;
