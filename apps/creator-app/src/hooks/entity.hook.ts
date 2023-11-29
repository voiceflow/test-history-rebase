import { Entity } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { entityNameValidator, entityVariantsValidator } from '@voiceflow/utils-designer';

import { Designer, Slot } from '@/ducks';
import { CanvasCreationType } from '@/ducks/tracking';
import { useCreateEntityModal, useEditEntityModal, useEntityCreateModalV2, useEntityEditModalV2 } from '@/hooks/modal.hook';

import { createUseFeatureSelector, useFeature } from './feature';
import { useStateWithKey } from './state.hook';
import { useDispatch, useGetValueSelector } from './store.hook';
import { useValidators } from './validate.hook';

export const useEntityMapSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(Slot.slotMapSelector, Designer.Entity.selectors.map);

export const useEntityMapByNameSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.slotNameMapSelector,
  Designer.Entity.selectors.mapByName
);

export const useAllEntitiesSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(Slot.allSlotsSelector, Designer.Entity.selectors.all);

export const useOneEntityByIDSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.slotByIDSelector,
  Designer.Entity.selectors.oneByID
);

export const useAllEntitiesByIDsSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.slotsByIDsSelector,
  Designer.Entity.selectors.allByIDs
);

export const useGetOneEntityByIDSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.getSlotByIDSelector,
  Designer.Entity.selectors.getOneByID
);

export const useAllEntitiesWithoutIDsSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.slotsWithoutIDsSelector,
  Designer.Entity.selectors.allWithoutIDs
);

export const useAllEntitiesOrderedByNameSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.allSlotsOrderedByNameSelector,
  Designer.Entity.selectors.allOrderedByName
);

export const useOneEntityWithVariantsByIDSelector = createUseFeatureSelector(Realtime.FeatureFlag.V2_CMS)(
  Slot.slotByIDSelector,
  Designer.Entity.selectors.oneWithVariantByID
);

export const useOnOpenEntityCreateModal = () => {
  const cmsV2 = useFeature(Realtime.FeatureFlag.V2_CMS);
  const entityCreateModal = useEntityCreateModalV2();
  const legacyCreateEntityModal = useCreateEntityModal();

  return async (data: { name: string; folderID: string | null; creationType: CanvasCreationType }) => {
    if (cmsV2.isEnabled) {
      const entity = await entityCreateModal.open(data);

      return {
        ...entity,
        // TODO: remove when we fully migrate to the V3 components
        isVariable: false,
      };
    }

    return legacyCreateEntityModal.open(data);
  };
};

export const useOnOpenEntityEditModal = () => {
  const cmsV2 = useFeature(Realtime.FeatureFlag.V2_CMS);
  const entityEditModal = useEntityEditModalV2();
  const legacyEditEntityModal = useEditEntityModal();

  return (data: { entityID: string }) => {
    if (cmsV2.isEnabled) return entityEditModal.openVoid(data);

    return legacyEditEntityModal.openVoid({ slotID: data.entityID });
  };
};

export const useEditEntityValidator = (entity: Entity | null) => {
  const createManyVariants = useDispatch(Designer.Entity.EntityVariant.effect.createMany);

  const getIntents = useGetValueSelector(Designer.Intent.selectors.all);
  const getEntities = useGetValueSelector(Designer.Entity.selectors.all);
  const getVariants = useGetValueSelector(Designer.Entity.EntityVariant.selectors.allByEntityID, { entityID: entity?.id ?? null });
  const getVariables = useGetValueSelector(Designer.Variable.selectors.all);

  const [nameError, nameErrorKey, setNameError] = useStateWithKey<string | null>(null);
  const [variantsError, variantsErrorKey, setVariantsError] = useStateWithKey<string | null>(null);

  const validator = useValidators({
    name: [entityNameValidator, setNameError],
    variants: [entityVariantsValidator, setVariantsError],
  });

  const validate = (entity: Entity, { validateOnly }: { validateOnly?: boolean } = {}) => {
    const variants = getVariants();

    const result = validator.validate(
      { name: entity.name, variants },
      { intents: getIntents(), entities: getEntities(), entityID: entity.id, variables: getVariables(), classifier: entity.classifier, validateOnly }
    );

    // needs at least one variant to show the error on ui
    if (!validateOnly && !result.success && result.errors.variants && !variants.length) {
      createManyVariants(entity.id, [{ value: '', synonyms: [] }]);
    }

    return result;
  };

  return {
    isValid: () => !entity || validate(entity).success,
    validate,
    nameError,
    nameErrorKey,
    setNameError,
    variantsError,
    resetNameError: () => setNameError(null),
    variantsErrorKey,
    setVariantsError,
    resetVariantsError: () => setVariantsError(null),
  };
};
