import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useVariableEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { VariableMenu } from '../VariableMenu/VariableMenu.component';
import type { IVariableSelect } from './VariableSelect.interface';

export const VariableSelect: React.FC<IVariableSelect> = ({ onSelect, variableID, menuProps, excludeVariableIDs: excludeVariableIDsProp }) => {
  const variable = useSelector(Designer.Variable.selectors.oneByID, { id: variableID });

  const variableEditModal = useVariableEditModal();

  const excludeVariableIDs = React.useMemo(
    () => [...(variableID ? [variableID] : []), ...(excludeVariableIDsProp ?? [])],
    [excludeVariableIDsProp, variableID]
  );

  return (
    <Dropdown
      value={variable?.name ?? null}
      label="variable"
      placeholder="Select variable"
      prefixIconName={variable ? 'EditS' : undefined}
      onPrefixIconClick={() => variable && variableEditModal.openVoid({ variableID: variable.id })}
    >
      {({ onClose, referenceRef }) => (
        <VariableMenu
          {...menuProps}
          width={referenceRef.current?.clientWidth}
          onClose={onClose}
          onSelect={onSelect}
          excludeVariableIDs={excludeVariableIDs}
        />
      )}
    </Dropdown>
  );
};
