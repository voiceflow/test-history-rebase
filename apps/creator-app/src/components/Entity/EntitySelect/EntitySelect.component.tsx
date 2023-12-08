import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useEntityEditModalV2 } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { EntityMenu } from '../EntityMenu/EntityMenu.component';
import type { IEntitySelect } from './EntitySelect.interface';

export const EntitySelect: React.FC<IEntitySelect> = ({ onSelect, entityID, menuProps, excludeEntitiesIDs: excludeEntitiesIDsProp }) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });

  const editEntityModal = useEntityEditModalV2();

  const excludeEntitiesIDs = React.useMemo(
    () => [...(entityID ? [entityID] : []), ...(excludeEntitiesIDsProp ?? [])],
    [excludeEntitiesIDsProp, entityID]
  );

  return (
    <Dropdown
      value={entity?.name ?? null}
      label="Entity"
      placeholder="Select entity to capture"
      prefixIconName={entity ? 'EditS' : undefined}
      onPrefixIconClick={() => entity && editEntityModal.openVoid({ entityID: entity.id })}
    >
      {({ onClose, referenceRef }) => (
        <EntityMenu
          {...menuProps}
          width={referenceRef.current?.clientWidth}
          onClose={onClose}
          onSelect={onSelect}
          excludeEntitiesIDs={excludeEntitiesIDs}
        />
      )}
    </Dropdown>
  );
};
