import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useAllEntitiesOrderedByNameSelector, useOnOpenEntityCreateModal } from '@/hooks/entity.hook';

import useNLUTable from '../hooks/useNLUTable';

export const ENTITIES_INTIAL_STATE = {
  entities: [],
  activeEntity: null,
  createEntity: Utils.functional.noop as any,
  deleteEntity: Utils.functional.noop as any,
  deleteEntities: Utils.functional.noop as any,
  renamingEntityID: '',
  selectedEntityIDs: new Set([]),
  toggleSelectedEntityID: Utils.functional.noop,
  setRenamingEntityID: Utils.functional.noop,
  setSelectedEntityIDs: Utils.functional.noop,
};

interface UseNLUEntitiesProps {
  activeItemID: string | null;
  goToItem: (id: string | null) => void;
}

const useNLUEntities = ({ activeItemID, goToItem }: UseNLUEntitiesProps) => {
  const entities = useAllEntitiesOrderedByNameSelector();
  const onOpenEntityCreateModal = useOnOpenEntityCreateModal();

  const table = useNLUTable(InteractionModelTabType.SLOTS, activeItemID, goToItem);

  const entitiesMap = React.useMemo(() => Utils.array.createMap(Utils.array.inferUnion(entities), (entity) => entity.id), [entities]);

  const createEntity = async (name = '') => {
    try {
      const entity = await onOpenEntityCreateModal({
        name,
        folderID: null,
        creationType: Tracking.CanvasCreationType.NLU_MANAGER,
      });

      goToItem(entity.id);
    } catch {
      // modal is closed
    }
  };

  return {
    entities,
    activeEntity: activeItemID ? entitiesMap[activeItemID] : null,
    createEntity,
    deleteEntity: table.deleteItem,
    deleteEntities: table.deleteItems,
    renamingEntityID: table.renamingItemID,
    selectedEntityIDs: table.selectedItemIDs,
    setRenamingEntityID: table.setRenamingItemID,
    setSelectedEntityIDs: table.setSelectedItemIDs,
    toggleSelectedEntityID: table.toggleSelectedItemID,
  };
};

export default useNLUEntities;
