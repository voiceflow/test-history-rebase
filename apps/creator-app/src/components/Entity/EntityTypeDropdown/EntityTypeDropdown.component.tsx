import { Utils } from '@voiceflow/common';
import { Dropdown, Menu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import type { IEntityTypeDropdown } from './EntityTypeDropdown.interface';

export const EntityTypeDropdown: React.FC<IEntityTypeDropdown> = ({ error, value, onValueChange }) => (
  <Dropdown value={value} label="Data type" placeholder="Select type" error={!!error} errorMessage={error ?? undefined}>
    {({ onClose, referenceRef }) => (
      <Menu width={referenceRef.current?.clientWidth}>
        {/* TODO: add entity types */}
        <MenuItem label="Custom" onClick={Utils.functional.chain(onClose, () => onValueChange('custom'))} />
        <MenuItem label="Todo 1" onClick={Utils.functional.chain(onClose, () => onValueChange('Todo 1'))} />
        <MenuItem label="Todo 2" onClick={Utils.functional.chain(onClose, () => onValueChange('Todo 2'))} />
      </Menu>
    )}
  </Dropdown>
);
