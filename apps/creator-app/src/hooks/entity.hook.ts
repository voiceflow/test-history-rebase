import { Designer } from '@/ducks';
import { CanvasCreationType } from '@/ducks/tracking';
import { IDSelectorParam, IDsSelectorParam } from '@/ducks/utils/crudV2';
import { useSelector } from '@/hooks';
import { useEntityCreateModalV2, useEntityEditModalV2 } from '@/hooks/modal.hook';

// TODO: maybe we should move all the selectors to the ducks
export const useEntityMapSelector = () => useSelector(Designer.Entity.selectors.map);
export const useEntityMapByNameSelector = () => useSelector(Designer.Entity.selectors.mapByName);
export const useAllEntitiesSelector = () => useSelector(Designer.Entity.selectors.all);
export const useOneEntityByIDSelector = (param: IDSelectorParam) => useSelector(Designer.Entity.selectors.oneByID, param);
export const useAllEntitiesByIDsSelector = (param: IDsSelectorParam) => useSelector(Designer.Entity.selectors.allByIDs, param);
export const useGetOneEntityByIDSelector = () => useSelector(Designer.Entity.selectors.getOneByID);
export const useAllEntitiesWithoutIDsSelector = (param: IDsSelectorParam) => useSelector(Designer.Entity.selectors.allWithoutIDs, param);
export const useAllEntitiesOrderedByNameSelector = () => useSelector(Designer.Entity.selectors.allOrderedByName);
export const useOneEntityWithVariantsByIDSelector = (param: IDSelectorParam) => useSelector(Designer.Entity.selectors.oneWithVariantByID, param);

export const useOnOpenEntityCreateModal = () => {
  const entityCreateModal = useEntityCreateModalV2();

  return async (data: { name: string; folderID: string | null; creationType: CanvasCreationType }) => {
    const entity = await entityCreateModal.open(data);

    return {
      ...entity,
      // TODO: remove when we fully migrate to the V3 components
      isVariable: false,
    };
  };
};

export const useOnOpenEntityEditModal = () => {
  const entityEditModal = useEntityEditModalV2();
  return (data: { entityID: string }) => entityEditModal.openVoid(data);
};
