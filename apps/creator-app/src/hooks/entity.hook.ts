import * as Realtime from '@voiceflow/realtime-sdk';

import { Designer, Slot } from '@/ducks';
import { CanvasCreationType } from '@/ducks/tracking';
import { useCreateEntityModal, useEditEntityModal, useEntityCreateModalV2, useEntityEditModalV2 } from '@/hooks/modal.hook';

import { createUseFeatureSelector, useFeature } from './feature';

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
