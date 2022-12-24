import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType, ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals, useOrderedEntities } from '@/hooks';

import useNLUTable from '../hooks/useNLUTable';

export const ENTITIES_INTIAL_STATE = {
  entities: [],
  activeEntity: null,
  createEntity: Utils.functional.noop,
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
  const addEntityModal = useModals(ModalType.ENTITY_CREATE);

  const table = useNLUTable(InteractionModelTabType.SLOTS, activeItemID, goToItem);

  const entitiesMap = React.useMemo(() => Utils.array.createMap(Utils.array.inferUnion(entities), (entity) => entity.id), [entities]);

  const createEntity = (name?: string) => {
    addEntityModal.open({ name, onCreate: (id: string) => goToItem(id), creationType: Tracking.CanvasCreationType.NLU_MANAGER });
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
