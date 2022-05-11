import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useCachedValue, useContextApi, useDidUpdateEffect, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType, ModalType, NLPProvider } from '@/constants';
import { NLUContext } from '@/contexts';
import * as Export from '@/ducks/export';
import * as IntentV2 from '@/ducks/intentV2';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { Variable } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/types';
import { useOrderedEntities, useOrderedIntents, useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';

interface NLUManagerProps {
  search: string;
  setSearch: (text: string) => void;
  activeTab: InteractionModelTabType;
  setActiveTab: (tab: InteractionModelTabType) => void;
  checkedItems: string[];
  setCheckedItems: (items: string[]) => void;
  toggleCheckedItem: (itemID: string) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string) => void;
  handleItemsDelete: () => void;
  handleSelectItem: (id: string) => void;
  toggleAllCheckedItems: () => void;
  deleteItem: (id: string, type: InteractionModelTabType) => void;
  selectedItem: AnyNLUItemType | null;
  createAndSelect: () => void;
  exportItems: () => void;
  isExporting: boolean;
  exportItem: (itemID: string, type: InteractionModelTabType, exportType?: NLPProvider | null) => void;
}

const DefaultState = {
  search: '',
  setSearch: Utils.functional.noop,
  activeTab: InteractionModelTabType.INTENTS,
  setActiveTab: Utils.functional.noop,
  checkedItems: [],
  setCheckedItems: Utils.functional.noop,
  toggleCheckedItem: Utils.functional.noop,
  selectedItemId: '',
  setSelectedItemId: Utils.functional.noop,
  handleItemsDelete: Utils.functional.noop,
  handleSelectItem: Utils.functional.noop,
  toggleAllCheckedItems: Utils.functional.noop,
  deleteItem: Utils.functional.noop,
  selectedItem: null,
  createAndSelect: Utils.functional.noop,
  exportItems: Utils.functional.noop,
  isExporting: false,
  exportItem: Utils.functional.noop,
};

export const NLUManagerContext = React.createContext<NLUManagerProps>(DefaultState);

const NLU_MANAGER_PERSISTED_STATE_KEY = 'NLU_MANAGER_PERSIST_KEY';

type AnyNLUItemType = Realtime.Intent | Realtime.Slot | Variable;

export const NLUManagerProvider: React.FC = ({ children }) => {
  const { deleteItem: deleteNLUItem, canDeleteItem, deleteItems: deleteNLUItems } = React.useContext(NLUContext);

  const [search, setSearch] = React.useState('');
  const [checkedItems, setCheckedItems] = React.useState<string[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<AnyNLUItemType | null>(null);
  const [exporting, setIsExporting] = React.useState(false);

  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);

  const location = useLocation();
  const exportModel = useDispatch(Export.exportModel);

  const modelMatch = React.useMemo(() => {
    return matchPath<{ modelType: InteractionModelTabType; modelEntityID?: string }>(location.pathname, {
      path: [Path.NLU_MANAGER_ENTITY],
    });
  }, [location.pathname]);

  const goToNLUManagerEntity = useDispatch(Router.goToCurrentNLUManagerEntity);

  const addIntentModal = useModals(ModalType.INTENT_CREATE);
  const addSlotModal = useModals(ModalType.ENTITY_CREATE);
  const addVariableModal = useModals(ModalType.VARIABLE_CREATE);

  const { sortedSlots } = useOrderedEntities();
  const { sortedIntents } = useOrderedIntents();
  const { mergedVariables, mergedVariablesMap } = useOrderedVariables();

  const [nluManagerPersistedState, setNluManagerPersistedState] = useSessionStorageState<{ tab: InteractionModelTabType; id?: string | null }>(
    `${NLU_MANAGER_PERSISTED_STATE_KEY}-${activeProjectID}`,
    {
      tab: InteractionModelTabType.INTENTS,
      id: null,
    }
  );

  const persistedStateRef = useCachedValue(nluManagerPersistedState);

  const activeTab = modelMatch?.params.modelType ?? persistedStateRef.current.tab ?? InteractionModelTabType.INTENTS;
  const activeID = modelMatch?.params.modelEntityID ? decodeURIComponent(modelMatch.params.modelEntityID) : persistedStateRef.current.id ?? '';

  const activeTabSelector = (activeTab: InteractionModelTabType, selectors: Partial<Record<InteractionModelTabType, () => any>>) =>
    selectors[activeTab]?.() ?? null;

  const handleSetPersistState = (tab: InteractionModelTabType, id?: string | null) => {
    const persistedState = { tab, id };
    setNluManagerPersistedState(persistedState);
    persistedStateRef.current = persistedState;
  };

  const exportItems = React.useCallback(async () => {
    setIsExporting(true);
    await exportModel(NLPProvider.VF_CSV, checkedItems);
    setIsExporting(false);
  }, [checkedItems]);

  const exportItem = React.useCallback(async (itemID: string, type: InteractionModelTabType, exportType?: NLPProvider | null) => {
    if (type === InteractionModelTabType.INTENTS && exportType) {
      toast.warn('Exporting...');
      setIsExporting(true);
      await exportModel(exportType, [itemID]);
      setIsExporting(false);
    }
  }, []);

  const reset = () => {
    setSelectedID(null);
    setSearch('');
    setCheckedItems([]);
  };

  const goToEntity = React.useCallback(
    (tab: InteractionModelTabType, id?: string | null) => {
      handleSetPersistState(tab, id);
      goToNLUManagerEntity(tab, id);
    },
    [goToNLUManagerEntity]
  );

  const setSelectedTab = React.useCallback(
    (tab: InteractionModelTabType) => {
      if (activeTab === tab) return;
      goToEntity(tab);
    },
    [goToEntity, activeTab]
  );

  const setSelectedID = React.useCallback(
    (id?: string | null) => {
      goToEntity(activeTab, id);
    },
    [activeTab, goToEntity]
  );

  const toggleAllCheckedItems = React.useCallback(() => {
    let targetIDs: string[] = [];
    let targetArray: { name: string; id: string }[] = [];
    if (checkedItems.length) {
      setCheckedItems([]);
    } else {
      targetArray =
        activeTabSelector(activeTab, {
          [InteractionModelTabType.INTENTS]: () => sortedIntents,
          [InteractionModelTabType.SLOTS]: () => sortedSlots,
          [InteractionModelTabType.VARIABLES]: () => mergedVariables.filter(({ type }) => type !== VariableType.BUILT_IN),
        }) ?? [];
    }

    const formattedSearch = search.trim().toLowerCase();
    targetIDs = targetArray.filter(({ name }) => name.toLowerCase().includes(formattedSearch)).map(({ id }) => id);
    setCheckedItems(targetIDs);
  }, [sortedIntents, sortedSlots, mergedVariables, activeTab, checkedItems, search]);

  const handleSelectItem = React.useCallback(
    (id: string) => {
      if (activeID === id) {
        setSelectedID(null);
      } else {
        setSelectedID(id);
      }
    },
    [activeID, setSelectedID]
  );

  const createAndSelect = React.useCallback(() => {
    activeTabSelector(activeTab, {
      [InteractionModelTabType.INTENTS]: () => addIntentModal.open({ onCreate: (id: string) => setSelectedID(id) }),
      [InteractionModelTabType.SLOTS]: () => addSlotModal.open({ onCreate: (slot: Realtime.Slot) => setSelectedID(slot.id) }),
      [InteractionModelTabType.VARIABLES]: () => addVariableModal.open({ onCreate: (slot: Realtime.Slot) => setSelectedID(slot.id) }),
    });
  }, [activeTab, addVariableModal, addIntentModal, addSlotModal]);

  const deleteItem = React.useCallback(
    async (id: string, type: InteractionModelTabType) => {
      const deletedItemIDs: string[] = [];
      if (canDeleteItem(id, type)) {
        deletedItemIDs.push(id);
        await deleteNLUItem(id, type);
        if (id === activeID) {
          setSelectedID(null);
        }
      } else {
        toast.error(`Cannot delete ${id}`);
      }

      const newCheckedItems = checkedItems.filter((itemID) => !deletedItemIDs.includes(itemID));
      setCheckedItems(newCheckedItems);
    },
    [activeID, checkedItems]
  );

  const handleItemsDelete = React.useCallback(async () => {
    const deletedItemIDs = await deleteNLUItems(checkedItems, activeTab);
    const newCheckedItems = checkedItems.filter((itemID) => {
      return !deletedItemIDs.includes(itemID);
    });
    setCheckedItems(newCheckedItems);

    if (deletedItemIDs.length) {
      toast.success(`Deleted ${deletedItemIDs.length} items`);
    }
  }, [deleteItem, deleteItem, checkedItems]);

  const toggleCheckedItem = React.useCallback(
    (id: string) => {
      if (checkedItems.includes(id)) {
        setCheckedItems([...checkedItems.filter((itemID) => itemID !== id)]);
      } else {
        setCheckedItems([...checkedItems, id]);
      }
    },
    [checkedItems]
  );

  useDidUpdateEffect(() => {
    if (!activeID) {
      setSelectedItem(null);
      return;
    }

    const activeItemData = activeTabSelector(activeTab, {
      [InteractionModelTabType.INTENTS]: () => intentsMap[activeID],
      [InteractionModelTabType.SLOTS]: () => allSlotsMap[activeID],
      [InteractionModelTabType.VARIABLES]: () => mergedVariablesMap[activeID],
    });

    setSelectedItem(activeItemData);
  }, [activeID, activeTab, intentsMap, allSlotsMap, mergedVariablesMap]);

  useDidUpdateEffect(() => {
    reset();
  }, [activeTab]);

  const api: NLUManagerProps = useContextApi({
    search,
    setSearch,
    activeTab,
    setActiveTab: setSelectedTab,
    checkedItems,
    setCheckedItems,
    toggleCheckedItem,
    selectedItemId: activeID,
    setSelectedItemId: setSelectedID,
    handleItemsDelete,
    handleSelectItem,
    toggleAllCheckedItems,
    deleteItem,
    selectedItem,
    createAndSelect,
    exportItems,
    exportItem,
    isExporting: exporting,
  });

  return <NLUManagerContext.Provider value={api}>{children}</NLUManagerContext.Provider>;
};
