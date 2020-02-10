import React from 'react';

import DropdownMultiselect from '@/componentsV2/DropdownMultiselect';
import Section from '@/componentsV2/Section';
import { Content, Controls } from '@/pages/Canvas/components/Editor/components';
import { without } from '@/utils/array';

import { HelpMessage, HelpTooltip } from './components';
import { PERMISSIONS } from './constants';

function PermissionEditor({ data, onChange }) {
  const { type, permissions } = data;

  const togglePermission = React.useCallback(
    (permission) => {
      onChange({
        permissions: permissions.includes(permission) ? without(permissions, permissions.indexOf(permission)) : [...permissions, permission],
      });
    },
    [permissions, onChange]
  );

  const displayName = permissions.map((permissionValue) => PERMISSIONS.find((permission) => permission.value === permissionValue).label).join(', ');

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            content: <HelpTooltip />,
            blockType: type,
            helpTitle: 'Having trouble?',
            helpMessage: <HelpMessage />,
          }}
        />
      )}
    >
      <Section>
        <label htmlFor="permissions-select">Permissions Request</label>

        <DropdownMultiselect
          buttonDisabled={permissions.length === 0}
          options={PERMISSIONS}
          autoWidth
          placeholder="Select all that apply"
          onSelect={togglePermission}
          selectedItems={permissions}
          buttonLabel="Unselect All"
          buttonClick={() => onChange({ permissions: [] })}
          selectedValue={displayName}
          dropdownActive
          withCaret
          id="permissions-select"
        />
      </Section>
    </Content>
  );
}

export default PermissionEditor;
