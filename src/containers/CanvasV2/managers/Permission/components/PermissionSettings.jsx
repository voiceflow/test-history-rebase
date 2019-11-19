import React from 'react';
import Toggle from 'react-toggle';

import Divider from '@/components/Divider';
import Button from '@/componentsV2/Button';
import { without } from '@/utils/array';

import Container from './Container';

const PERMISSIONS = [
  { name: 'Reminders', code: 'alexa::alerts:reminders:skill:readwrite' },
  { name: 'Notifications', code: 'alexa::devices:all:notifications:write' },
  { name: 'Address', code: 'alexa::devices:all:address:full:read' },
  { name: 'Full Name', code: 'alexa::profile:name:read' },
  { name: 'Email', code: 'alexa::profile:email:read' },
  { name: 'Phone', code: 'alexa::profile:mobile_number:read' },
  { name: 'Skill Personalization', code: 'alexa::person_id:read' },
];

const PermissionSettings = ({ data, onChange, onToggle }) => {
  const toggleCustom = React.useCallback(() => onChange({ custom: !data.custom }), [data.custom, onChange]);

  const togglePermission = React.useCallback(
    (permission) => () =>
      onChange({
        permissions: data.permissions.includes(permission)
          ? without(data.permissions, data.permissions.indexOf(permission))
          : [...data.permissions, permission],
      }),
    [data.permissions, onChange]
  );

  return (
    <div>
      <Button variant="secondary" icon="arrowLeft" onClick={onToggle}>
        Back
      </Button>
      <div className="space-between mt-3">
        <label>Custom Permissions</label>
        <Toggle checked={data.custom} onChange={toggleCustom} icons={false} />
      </div>
      {data.custom && (
        <>
          <Divider />
          <Container>
            {PERMISSIONS.map((permission) => (
              <div className="space-between" key={permission.code}>
                <label>{permission.name}</label>
                <Toggle checked={data.permissions.includes(permission.code)} onChange={togglePermission(permission.code)} icons={false} />
              </div>
            ))}
          </Container>
        </>
      )}
    </div>
  );
};

export default PermissionSettings;
