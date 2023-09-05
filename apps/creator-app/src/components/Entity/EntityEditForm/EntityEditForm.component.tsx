// import { Divider } from '@voiceflow/ui-next';

import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { EntityEditVariantsSection } from '../EntityEditVariantsSection/EntityEditVariantsSection.component';
// import { EntityIsArraySection } from '../EntityIsArraySection/EntityIsArraySection.component';
// import { EntityTypeColorSection } from '../EntityTypeColorSection/EntityTypeColorSection.component';
import type { IEntityEditForm } from './EntityEditForm.interface';

export const EntityEditForm: React.FC<IEntityEditForm> = ({ entityID }) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });

  // const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);

  if (!entity) return null;

  return (
    <>
      {/* <EntityTypeColorSection
        pt={pt}
        pb={24}
        type={entity.classifier}
        name={entity.name}
        color={entity.color}
        onTypeChange={(classifier) => patchEntity({ classifier })}
        onColorChange={(color) => patchEntity({ color })}
      /> */}

      {/* TODO: use enum or const */}
      {entity.classifier === 'custom' && (
        <>
          {/* <Divider /> */}

          <EntityEditVariantsSection entityID={entityID} />
        </>
      )}

      {/* <Divider />

      <EntityIsArraySection pb={16} value={entity.isArray} onValueChange={(isArray) => patchEntity({ isArray })} /> */}
    </>
  );
};
