import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useOrderedEntities } from '@/hooks';
import { useModal } from '@/ModalsV2/hooks';
import Create from '@/ModalsV2/modals/NLU/Entity/Create';

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
  const entities = useOrderedEntities();
  const createEntityModal = useModal(Create);

  const table = useNLUTable(InteractionModelTabType.SLOTS, activeItemID, goToItem);

  const entitiesMap = React.useMemo(() => Utils.array.createMap(Utils.array.inferUnion(entities), (entity) => entity.id), [entities]);

  const createEntity = async (name?: string) => {
    try {
      const entity = await createEntityModal.open({ name, creationType: Tracking.CanvasCreationType.NLU_MANAGER });
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
