import { CUSTOM_SLOT_TYPE, Utils } from '@voiceflow/common';
import type { Entity, EntityVariant } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { Divider, Scroll, useConst } from '@voiceflow/ui-next';
import { entityNameValidator, entityVariantsValidator, validatorFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityVariantInput } from '@/components/Entity/EntityVariantInput/EntityVariantInput.component';
import { EntityVariantsSection } from '@/components/Entity/EntityVariantsSection/EntityVariantsSection.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useRandomCustomThemeColor } from '@/hooks/custom-theme.hook';
import { useInputAutoFocusKey, useInputState } from '@/hooks/input.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import { transformVariableName } from '@/utils/variable.util';

import { modalsManager } from '../../manager';

export interface IEntityCreateModal {
  name?: string;
  folderID: string | null;
}

export const EntityCreateModal = modalsManager.create<IEntityCreateModal, Entity>(
  'EntityCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const getIntents = useGetValueSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
      const getEntities = useGetValueSelector(Designer.Entity.selectors.all);
      const getVariables = useGetValueSelector(Designer.Variable.selectors.all);

      const createOne = useDispatch(Designer.Entity.effect.createOne);

      const nameState = useInputState({ value: nameProp ?? '' });
      const variantsState = useInputState<Pick<EntityVariant, 'id' | 'value' | 'synonyms'>[]>({ value: useConst([]) });
      const classifierState = useInputState();
      const [color, setColor] = useState(useRandomCustomThemeColor());

      const autofocus = useInputAutoFocusKey();

      const validator = useValidators({
        name: [entityNameValidator, nameState.setError],
        variants: [entityVariantsValidator, variantsState.setError],
        classifier: [validatorFactory((value: string) => value, 'Type is required.'), classifierState.setError],
      });

      const onClassifierChange = (value: string) => {
        classifierState.setValue(value);

        if (value !== CUSTOM_SLOT_TYPE) {
          variantsState.setValue([]);
        } else if (!variantsState.value.length) {
          onVariantAdd();
        }
      };

      const onVariantAdd = () => {
        const id = Utils.id.cuid.slug();

        variantsState.setValue((prev) => [{ id, value: '', synonyms: [] }, ...prev]);
        autofocus.setKey(id);
      };

      const onVariantRemove = (id: string) => {
        variantsState.setValue((prev) => prev.filter((item) => item.id !== id));
      };

      const onVariantChange = (id: string, data: { value: string; synonyms: string[] }) => {
        variantsState.setValue((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
      };

      const onGenerated = (items: Pick<EntityVariant, 'value' | 'synonyms'>[]) => {
        variantsState.setValue((prev) => [...items.map(({ value, synonyms }) => ({ id: Utils.id.cuid.slug(), value, synonyms })), ...prev]);
      };

      const onCreate = validator.container(
        async ({ classifier, variants, ...fields }) => {
          api.preventClose();

          try {
            const entity = await createOne({
              ...fields,
              color,
              isArray: false,
              folderID,
              variants: variants.map(({ value, synonyms }) => ({ value, synonyms })).reverse(),
              classifier,
              description: null,
            });

            api.resolve(entity);
            api.enableClose();
            api.close();
          } catch (e) {
            toast.genericError();

            api.enableClose();
          }
        },
        () => ({
          intents: getIntents(),
          entities: getEntities(),
          entityID: null,
          variables: getVariables(),
          classifier: classifierState.value,
        })
      );

      const onSubmit = () => onCreate({ name: nameState.value, classifier: classifierState.value, variants: variantsState.value });

      api.useOnCloseRequest((source) => source !== 'backdrop');

      return (
        <Modal.Container
          type={typeProp}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          onEscClose={api.onEscClose}
          onEnterSubmit={onSubmit}
        >
          <Modal.Header title="Create entity" onClose={api.onClose} />

          <Scroll style={{ display: 'block' }}>
            <Modal.Body gap={20}>
              <CMSFormName
                value={nameState.value}
                error={nameState.error}
                disabled={closePrevented}
                autoFocus
                transform={transformVariableName}
                placeholder="Enter entity name"
                onValueChange={nameState.setValue}
              />

              <EntityClassifierColorSection
                name={nameState.value}
                color={color}
                disabled={closePrevented}
                typeError={classifierState.error}
                classifier={classifierState.value}
                typeMinWidth={188}
                onColorChange={setColor}
                onClassifierClick={classifierState.resetError}
                onClassifierChange={onClassifierChange}
              />
            </Modal.Body>

            <Divider fullWidth noPadding />

            <EntityVariantsSection
              name={nameState.value}
              onAdd={onVariantAdd}
              variants={variantsState.value}
              onRemove={onVariantRemove}
              disabled={closePrevented}
              classifier={classifierState.value}
              onGenerated={onGenerated}
              autoScrollToTopRevision={autofocus.key}
              renderVariantInput={({ item, onEmpty, disabled }) => (
                <EntityVariantInput
                  value={item.value}
                  error={variantsState.error}
                  onAdd={onVariantAdd}
                  onEmpty={onEmpty}
                  synonyms={item.synonyms}
                  disabled={disabled}
                  autoFocus={item.id === autofocus.key}
                  resetError={variantsState.resetError}
                  onValueChange={(value) => onVariantChange(item.id, { ...item, value })}
                  onSynonymsChange={(synonyms) => onVariantChange(item.id, { ...item, synonyms })}
                />
              )}
            />
          </Scroll>

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.onClose} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create entity" variant="primary" onClick={onSubmit} disabled={closePrevented} isLoading={closePrevented} />
          </Modal.Footer>
        </Modal.Container>
      );
    }
);
