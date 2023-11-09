import { Utils } from '@voiceflow/common';
import type { Entity, EntityVariant } from '@voiceflow/dtos';
import { toast } from '@voiceflow/ui';
import { Box, Divider } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { AIGenerateEntityVariant } from '@/components/AI/AIGenerateEntityVariantButton/AIGenerateEntityVariant.component';
import { useAIGenerateEntityVariants } from '@/components/AI/hooks/ai-generate-entity-variants.hook';
import { CMSFormCollapsibleList } from '@/components/CMS/CMSForm/CMSFormCollapsibleList/CMSFormCollapsibleList.component';
import { CMSFormName } from '@/components/CMS/CMSForm/CMSFormName/CMSFormName.component';
import { CMSFormVirtualListItem } from '@/components/CMS/CMSForm/CMSFormVirtualListItem/CMSFormVirtualListItem.component';
// import { EntityIsArraySection } from '@/components/Entity/EntityIsArraySection/EntityIsArraySection.component';
// import { EntityTypeColorSection } from '@/components/Entity/EntityTypeColorSection/EntityTypeColorSection.component';
import { EntityVariantInput } from '@/components/Entity/EntityVariantInput/EntityVariantInput.component';
import { EntityVariantsSection } from '@/components/Entity/EntityVariantsSection/EntityVariantsSection.component';
import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useInputAutoFocusKey, useInputStateWithError } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useValidator } from '@/hooks/validate.hook';
import { isEntityVariantLikeEmpty } from '@/utils/entity.util';
import { requiredNameValidator } from '@/utils/validation.util';

import { modalsManager } from '../../manager';

export interface IEntityCreateModal {
  name?: string;
  folderID: string | null;
}

export const EntityCreateModal = modalsManager.create<IEntityCreateModal, Entity>(
  'EntityCreateModal',
  () =>
    ({ api, type: typeProp, name: nameProp, opened, hidden, animated, folderID, closePrevented }) => {
      const createOne = useDispatch(Designer.Entity.effect.createOne);

      const [color] = useState('neutral');
      const [isArray] = useState(false);
      // TODO: replace initial value with empty array by default when type is implemented
      const [variants, setVariants] = useState<Pick<EntityVariant, 'id' | 'value' | 'synonyms'>[]>(() => [
        { id: Utils.id.cuid.slug(), value: '', synonyms: [] },
      ]);
      const [isListEmpty, onListItemEmpty] = useIsListEmpty(variants, isEntityVariantLikeEmpty);
      const [autoFocusKey, setAutoFocusKey] = useInputAutoFocusKey();
      const [name, nameError, setName, setNameError] = useInputStateWithError(nameProp ?? '');
      // TODO: use enum or const
      const [type, , , setTypeError] = useInputStateWithError('custom');

      const validator = useValidator<{ name: string; type: string }>({
        setNameError,
        setTypeError,
        validateType: (value) => !value && 'Type is required.',
        validateName: requiredNameValidator,
      });

      const aiGenerate = useAIGenerateEntityVariants({
        examples: variants,
        entityName: name,
        entityType: type,
        onGenerated: (items) =>
          setVariants((prev) => [...items.map(({ value, synonyms }) => ({ id: Utils.id.cuid.slug(), value, synonyms })), ...prev]),
      });

      // const onTypeChange = (value: string) => {
      //   setType(value);

      //   // TODO: use enum or const
      //   if (value === 'custom') {
      //     onVariantAdd();
      //   } else {
      //     setVariants([]);
      //   }
      // };

      const onVariantAdd = () => {
        const id = Utils.id.cuid.slug();

        setVariants((prev) => [{ id, value: '', synonyms: [] }, ...prev]);
        setAutoFocusKey(id);
      };

      const onVariantRemove = (id: string) => {
        setVariants((prev) => prev.filter((item) => item.id !== id));
      };

      const onVariantChange = (id: string, data: { value: string; synonyms: string[] }) => {
        setVariants((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
      };

      const onCreate = validator.container(async ({ type: classifier, ...fields }) => {
        api.preventClose();

        try {
          const entity = await createOne({
            ...fields,
            color,
            isArray,
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
      });

      return (
        <Modal type={typeProp} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} onEscClose={api.close}>
          <Modal.Header title="Create entity" onClose={api.close} />

          <CMSFormName pb={20} value={name} error={nameError} autoFocus placeholder="Enter entity name" onValueChange={setName} />

          {/* <EntityTypeColorSection
            pb={24}
            type={type}
            name={name}
            color={color}
            typeError={typeError}
            onTypeChange={onTypeChange}
            onColorChange={setColor}
          /> */}

          {/* TODO: use enum or const */}
          {type === 'custom' && (
            <>
              <Divider />

              <EntityVariantsSection onAdd={onVariantAdd}>
                <CMSFormCollapsibleList
                  items={variants}
                  itemsLimit={5}
                  collapseLabel="values"
                  estimatedItemSize={53}
                  autoScrollToTopRevision={autoFocusKey}
                  renderItem={({ item, virtualizer, virtualItem }) => (
                    <CMSFormVirtualListItem
                      pt={9}
                      pb={7}
                      ref={virtualizer.measureElement}
                      key={virtualItem.key}
                      align="center"
                      index={virtualItem.index}
                      onRemove={variants.length === 1 ? null : () => onVariantRemove(item.id)}
                    >
                      <EntityVariantInput
                        value={item.value}
                        onEmpty={onListItemEmpty(virtualItem.index)}
                        synonyms={item.synonyms}
                        autoFocus={item.id === autoFocusKey}
                        onValueChange={(value) => onVariantChange(item.id, { ...item, value })}
                        onSynonymsChange={(synonyms) => onVariantChange(item.id, { ...item, synonyms })}
                      />
                    </CMSFormVirtualListItem>
                  )}
                />
              </EntityVariantsSection>

              <Box px={16} pb={16}>
                <AIGenerateEntityVariant
                  isLoading={aiGenerate.fetching}
                  onGenerate={aiGenerate.onGenerate}
                  hasExtraContext={!!name || !!type || !isListEmpty}
                />
              </Box>
            </>
          )}

          {/* <Divider />

          <EntityIsArraySection pb={16} value={isArray} onValueChange={setIsArray} /> */}

          <Modal.Footer>
            <Modal.Footer.Button variant="secondary" onClick={api.close} disabled={closePrevented} label="Cancel" />

            <Modal.Footer.Button label="Create Entity" variant="primary" onClick={() => onCreate({ name, type })} disabled={closePrevented} />
          </Modal.Footer>
        </Modal>
      );
    }
);
