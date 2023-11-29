import { Utils } from '@voiceflow/common';
import { VariableNameTransformDTO } from '@voiceflow/dtos';
import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useEditEntityValidator } from '@/hooks/entity.hook';
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

      const editEntityValidator = useEditEntityValidator(entity);

      const onEntitySelect = (id: string) => {
        if (!editEntityValidator.isValid()) return;

        api.updateProps({ entityID: id }, { reopen: true });
      };

      const onNameChange = (name: string) => {
        editEntityValidator.resetNameError();

        if (name) {
          patchEntity({ name });
        }
      };

      api.useOnCloseRequest(editEntityValidator.isValid);

      return (
        <Modal.Container type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header
            title="Edit entity"
            onClose={api.close}
            leftButton={<Modal.HeaderMenu items={entities} activeID={entityID} onSelect={onEntitySelect} />}
            secondaryButton={<Modal.HeaderMore options={[{ name: 'Delete', onClick: Utils.functional.chain(deleteEntity, api.close) }]} />}
          />

          {entity ? (
            <>
              <Modal.Body gap={20}>
                <CMSFormName
                  value={entity.name}
                  error={editEntityValidator.nameError}
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

              <EntityEditVariantsSection
                entity={entity}
                variantsError={editEntityValidator.variantsError}
                resetVariantsError={editEntityValidator.resetVariantsError}
              />
            </>
          ) : (
            <Modal.Body>Entity not found</Modal.Body>
          )}

          <Modal.Footer>
            <Modal.Footer.Button label="Close" variant="secondary" onClick={api.close} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
