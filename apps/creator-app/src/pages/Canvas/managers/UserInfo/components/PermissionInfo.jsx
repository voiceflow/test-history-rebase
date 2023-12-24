import React from 'react';

import VariableSelect from '@/components/VariableSelect';
import { PERMISSIONS_WITH_VARIABLE_MAPS } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';

const PermissionInfo = ({ permission, onChange }) => {
  const isMappable = permission.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(permission.selected);

  const updateVariable = React.useCallback((mapTo) => onChange({ mapTo }), [onChange]);

  if (isMappable) {
    return (
      <FormControl label="Map Info to Variable">
        <VariableSelect value={permission.mapTo} onChange={updateVariable} />
      </FormControl>
    );
  }

  return null;
};

export default PermissionInfo;
