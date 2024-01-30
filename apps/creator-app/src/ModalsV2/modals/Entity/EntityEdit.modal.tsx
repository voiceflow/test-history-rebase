import { Divider, Scroll, toast } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { transformVariableName } from '@/utils/variable.util';

import { modalsManager } from '../../manager';

export interface IEntityEditModal {
  entityID: string;
}

export const EntityEditModal = modalsManager.create<IEntityEditModal>(
  'EntityEditModal',
  () =>
    ({ api, type, opened, hidden, entityID, animated }) => {
      const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
      const entities = useSelector(Designer.Entity.selectors.all);

      const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);
      const deleteEntity = useDispatch(Designer.Entity.effect.deleteOne, entityID);

      const onEntitySelect = (id: string) => {
        api.updateProps({ entityID: id }, { reopen: true });
      };

      const onNameChange = (name: string) => {
        if (!name) return;

        patchEntity({ name });
      };

      const onEntityDelete = async () => {
        api.close();

        await deleteEntity();

        toast.info('Deleted', { showIcon: false });
      };

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.onEscClose}>
          <Modal.Header
            title="Edit entity"
            onClose={api.onClose}
            leftButton={<Modal.HeaderMenu items={entities} activeID={entityID} onSelect={onEntitySelect} notFoundLabel="entities" />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: onEntityDelete }]} />}
          />

          <>
            {entity ? (
              <Scroll style={{ display: 'block' }}>
                <Modal.Body gap={16}>
                  <CMSFormName
                    value={entity.name}
                    transform={transformVariableName}
                    autoFocus
                    placeholder="Enter entity name"
                    onValueChange={onNameChange}
                  />

                  <EntityClassifierColorSection
                    name={entity.name}
                    color={entity.color}
                    classifier={entity.classifier}
                    onColorChange={(color) => patchEntity({ color })}
                    onClassifierChange={(classifier) => patchEntity({ classifier })}
                    classifierMinWidth={188}
                  />
                </Modal.Body>

                <Divider noPadding />

                <EntityEditVariantsSection entity={entity} />
              </Scroll>
            ) : (
              <Modal.Body>Entity not found</Modal.Body>
            )}
          </>

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.onClose} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
