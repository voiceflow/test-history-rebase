import { SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { EntityEditForm } from '@/components/Entity/EntityEditForm/EntityEditForm.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { modalsManager } from '../../manager';

export interface IEntityEditModal {
  entityID: string;
}

export const EntityEditModal = modalsManager.create<IEntityEditModal>(
  'EntityEditModal',
  () =>
    ({ api, type, opened, hidden, entityID, animated, closePrevented }) => {
      const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
      const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header
            title="Edit entity"
            onClose={api.close}
            leftButton={<SquareButton iconName="Menu" />}
            secondaryButton={<SquareButton iconName="More" />}
          />

          {!!entity && (
            <>
              <CMSFormName pb={24} value={entity.name} placeholder="Enter entity name" onValueChange={(name) => name && patchEntity({ name })} />

              <EntityEditForm entityID={entityID} />
            </>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.close} disabled={closePrevented} />
          </Modal.Footer>
        </Modal>
      );
    }
);
