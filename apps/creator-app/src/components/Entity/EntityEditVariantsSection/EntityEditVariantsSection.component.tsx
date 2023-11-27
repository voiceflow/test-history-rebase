import { EntityVariant } from '@voiceflow/dtos';
import React from 'react';

import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { EntityVariantInput } from '../EntityVariantInput/EntityVariantInput.component';
import { EntityVariantsSection } from '../EntityVariantsSection/EntityVariantsSection.component';
import type { IEntityEditVariantsSection } from './EntityEditVariantsSection.interface';

export const EntityEditVariantsSection: React.FC<IEntityEditVariantsSection> = ({ entity, variantsError, resetVariantsError }) => {
  const variants = useSelector(Designer.Entity.EntityVariant.selectors.allByEntityID, { entityID: entity.id });

  const patchOne = useDispatch(Designer.Entity.EntityVariant.effect.patchOne);
  const createOne = useDispatch(Designer.Entity.EntityVariant.effect.createOne, entity.id);
  const deleteOne = useDispatch(Designer.Entity.EntityVariant.effect.deleteOne);
  const createMany = useDispatch(Designer.Entity.EntityVariant.effect.createMany, entity.id);

  const autofocus = useInputAutoFocusKey();

  const onVariantAdd = async () => {
    const variant = await createOne({ value: '', synonyms: [] });

    autofocus.setKey(variant.id);
  };

  const onVariantChange = (id: string, patch: Partial<Pick<EntityVariant, 'value' | 'synonyms'>>) => {
    patchOne(id, patch);
    resetVariantsError();
  };

  return (
    <EntityVariantsSection
      name={entity.name}
      onAdd={onVariantAdd}
      variants={variants}
      onRemove={deleteOne}
      classifier={entity.classifier}
      onGenerated={createMany}
      autoScrollToTopRevision={autofocus.key}
      renderVariantInput={({ item, onEmpty, disabled }) => (
        <EntityVariantInput
          value={item.value}
          onAdd={onVariantAdd}
          error={variantsError}
          onEmpty={onEmpty}
          synonyms={item.synonyms}
          disabled={disabled}
          autoFocus={item.id === autofocus.key}
          resetError={resetVariantsError}
          onValueChange={(value) => onVariantChange(item.id, { ...item, value })}
          onSynonymsChange={(synonyms) => onVariantChange(item.id, { ...item, synonyms })}
        />
      )}
    />
  );
};
