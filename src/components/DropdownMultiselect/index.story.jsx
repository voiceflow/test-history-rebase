import React from 'react';

import { toggleMembership } from '@/utils/array';

import DropdownMultiselect from '.';

const PERMISSIONS = [
  { label: 'Reminders', value: 'alexa::alerts:reminders:skill:readwrite' },
  { label: 'Lists Read', value: 'alexa::household:lists:read' },
  { label: 'Lists Write', value: 'alexa::household:lists:write' },
  { label: 'Notifications', value: 'alexa::devices:all:notifications:write' },
  { label: 'Address', value: 'alexa::devices:all:address:full:read' },
  { label: 'Full Name', value: 'alexa::profile:name:read' },
  { label: 'Email', value: 'alexa::profile:email:read' },
  { label: 'Phone', value: 'alexa::profile:mobile_number:read' },
  { label: 'Location Services', value: 'alexa::devices:all:geolocation:read' },
  { label: 'Skill Personalization', value: 'alexa::person_id:read' },
];

export default {
  title: 'DropdownMultiselect',
  component: DropdownMultiselect,
  includeStories: [],
};

export const normal = () => {
  const [permissions, setPermissions] = React.useState([]);
  const displayName = permissions.map((permissionValue) => PERMISSIONS.find((permission) => permission.value === permissionValue).label).join(', ');

  return (
    <div style={{ width: '300px' }}>
      <DropdownMultiselect
        buttonDisabled={permissions.length === 0}
        options={PERMISSIONS}
        autoWidth
        placeholder="Select all that apply"
        onSelect={(permission) => setPermissions(toggleMembership(permissions, permission))}
        selectedItems={permissions}
        buttonLabel="Unselect All"
        buttonClick={() => setPermissions([])}
        selectedValue={displayName}
        dropdownActive
        withCaret
        id="permissions-select"
      />
    </div>
  );
};
