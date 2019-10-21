import React from 'react';

import PermissionSelect from '@/components/PermissionSelect';
import { PERMISSIONS_WITH_VARIABLE_MAPS } from '@/constants';
import { RemovableSection } from '@/containers/CanvasV2/components/BlockEditor';

import VariableLabel from './VariableLabel';

function Permission({ permission, selectedPermissions, onRemove, onUpdate }) {
  const canVariableMap = permission.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(permission.selected);
  const updateSelected = (selected) => onUpdate({ selected });

  return (
    <RemovableSection onClose={onRemove}>
      <label className="mt-0">{canVariableMap ? 'Request User Information' : 'Check Permission Enabled'}</label>
      <PermissionSelect value={permission.selected} onChange={updateSelected} disabledOptions={selectedPermissions} />
      <VariableLabel permission={permission} canVariableMap={canVariableMap} onUpdate={onUpdate} />
    </RemovableSection>
  );
}

export default Permission;
