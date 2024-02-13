import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useEntityEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { EntityMenu } from '../EntityMenu/EntityMenu.component';
import type { IEntitySelect } from './EntitySelect.interface';

export const EntitySelect: React.FC<IEntitySelect> = ({ onSelect, entityID, testID, menuProps, excludeIDs: excludeIDsProp }) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });

  const entityEditModal = useEntityEditModal();

  const excludeIDs = React.useMemo(() => [...(entityID ? [entityID] : []), ...(excludeIDsProp ?? [])], [excludeIDsProp, entityID]);

  return (
    <Dropdown
      value={entity?.name ?? null}
      label="Entity"
      placeholder="Select entity to capture"
      prefixIconName={entity ? 'EditS' : undefined}
      onPrefixIconClick={() => entity && entityEditModal.openVoid({ entityID: entity.id })}
      testID={testID}
    >
      {({ onClose, referenceRef }) => (
        <EntityMenu {...menuProps} width={referenceRef.current?.clientWidth} onClose={onClose} onSelect={onSelect} excludeIDs={excludeIDs} />
      )}
    </Dropdown>
  );
};
