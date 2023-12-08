import { VariableNameTransformDTO } from '@voiceflow/dtos';
import { Divider, Scroll, toast } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
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

        toast.info('Deleted', { showIcon: false, isClosable: false });
      };

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header
            title="Edit entity"
            onClose={api.close}
            leftButton={<Modal.HeaderMenu items={entities} activeID={entityID} onSelect={onEntitySelect} />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: onEntityDelete }]} />}
          />

          <>
            {entity ? (
              <Scroll style={{ display: 'block' }}>
                <Modal.Body gap={20}>
                  <CMSFormName
                    value={entity.name}
                    transform={VariableNameTransformDTO.parse}
                    autoFocus
                    placeholder="Enter entity name"
                    onValueChange={onNameChange}
                  />

                  <EntityClassifierColorSection
                    name={entity.name}
                    color={entity.color}
                    classifier={entity.classifier}
                    typeMinWidth={188}
                    onColorChange={(color) => patchEntity({ color })}
                    onClassifierChange={(classifier) => patchEntity({ classifier })}
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
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.close} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
