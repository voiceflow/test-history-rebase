import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useCachedValue, useContextApi, useDidUpdateEffect, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType, ModalType } from '@/constants';
import { NLUContext } from '@/contexts';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import {
  OrderedVariable,
  useDispatch,
  useModals,
  useOrderedEntities,
  useOrderedIntents,
  useOrderedVariables,
  useSelector,
  useTrackingEvents,
} from '@/hooks';

import { EditorTabs } from './constants';
import useClarity from './hooks/useClarity';
import useEditorTab from './hooks/useEditorTab';
import useNotifications from './hooks/useNotifications';
import { ClarityModel, IntentNotification, NLUIntent } from './types';

export type AnyItem = OrderedVariable | NLUIntent | Realtime.Slot;

export interface NLUManagerContextValue<I extends AnyItem = AnyItem> {
  items: I[];
  search: string;
  goToTab: (type: InteractionModelTabType, itemID?: string | null) => void;
  goToItem: (id: string | null) => void;
  itemsMap: Record<string, I>;
  tabItemsMap: Record<InteractionModelTabType, AnyItem[]>;
  setSearch: (text: string) => void;
  activeTab: InteractionModelTabType;
  deleteItem: (id: string) => void;
  activeItem: I | null;
  activeItemID: string | null;
  renamingItemID: string | null;
  selectedItemIDs: Set<string>;
  createAndGoToItem: (name?: string) => void;
  setRenamingItemID: (itemID: string | null) => void;
  setSelectedItemIDs: (itemIDs: string[]) => void;
  toggleActiveItemID: (id?: string) => void;
  deleteSelectedItems: VoidFunction;
  toggleSelectedItemID: (itemID: string) => void;
  isEditorTabActive: (tab: EditorTabs) => boolean;
  openEditorTab: (tab: EditorTabs) => void;
  closeEditorTab: () => void;
  isScrolling: boolean;
  isFetchingClarity: boolean;
  setIsScrolling: (isScrolling: boolean) => void;
  inFullScreenTab: boolean | null;
  clarity: ClarityModel | null;
  notifications: IntentNotification[];
  fetchClarity: (updatedModel?: Record<string, Partial<Realtime.Intent>>) => void;
}

const INITIAL_STATE: NLUManagerContextValue = {
  items: [],
  search: '',
  goToTab: Utils.functional.noop,
  itemsMap: {},
  tabItemsMap: {} as Record<InteractionModelTabType, AnyItem[]>,
  goToItem: Utils.functional.noop,
  setSearch: Utils.functional.noop,
  activeTab: InteractionModelTabType.INTENTS,
  deleteItem: Utils.functional.noop,
  activeItem: null,
  activeItemID: null,
  renamingItemID: null,
  selectedItemIDs: new Set(),
  createAndGoToItem: Utils.functional.noop,
  setRenamingItemID: Utils.functional.noop,
  setSelectedItemIDs: Utils.functional.noop,
  toggleActiveItemID: Utils.functional.noop,
  deleteSelectedItems: Utils.functional.noop,
  toggleSelectedItemID: Utils.functional.noop,
  isEditorTabActive: () => false,
  openEditorTab: Utils.functional.noop,
  closeEditorTab: Utils.functional.noop,
  isScrolling: false,
  isFetchingClarity: false,
  setIsScrolling: Utils.functional.noop,
  inFullScreenTab: null,
  clarity: null,
  notifications: [],
  fetchClarity: Utils.functional.noop,
};

export const NLUManagerContext = React.createContext<NLUManagerContextValue>(INITIAL_STATE);

const NLU_MANAGER_PERSISTED_STATE_KEY = 'NLU_MANAGER_PERSIST_KEY';

interface NLUPersistedState {
  id?: string | null;
  tab: InteractionModelTabType;
}

interface MatchPathParams {
  modelType: InteractionModelTabType;
  modelEntityID?: string;
}

const activeTabSelector = <T, R, S>(
  activeTab: InteractionModelTabType,
  selectors: {
    [InteractionModelTabType.SLOTS]?: () => T;
    [InteractionModelTabType.INTENTS]?: () => R;
    [InteractionModelTabType.VARIABLES]?: () => S;
  }
) => selectors[activeTab]?.() ?? null;

export const NLUManagerProvider: React.FC = ({ children }) => {
  const nlu = React.useContext(NLUContext);

  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState('');
  const [renamingItemID, setRenamingItemID] = React.useState<string | null>(null);
  const [selectedItemIDs, setSelectedItemIDsSet] = React.useState<Set<string>>(() => new Set());
  const { isTabActive: isEditorTabActive, closeEditorTab, openEditorTab, inFullScreenTab } = useEditorTab();

  const location = useLocation();

  const intents = useOrderedIntents();
  const entities = useOrderedEntities();
  const [variables] = useOrderedVariables();

  const { fetchClarity, clarity, nluIntents, isFetching: isFetchingClarity } = useClarity(intents);
  const notifications = useNotifications(nluIntents);

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const modelMatch = React.useMemo(() => matchPath<MatchPathParams>(location.pathname, { path: [Path.NLU_MANAGER_ENTITY] }), [location.pathname]);

  const goToNLUManagerEntity = useDispatch(Router.goToCurrentNLUManagerEntity);

  const [trackingEvents] = useTrackingEvents();

  const addSlotModal = useModals(ModalType.ENTITY_CREATE);
  const addIntentModal = useModals(ModalType.INTENT_CREATE);
  const addVariableModal = useModals(ModalType.VARIABLE_CREATE);

  const [nluManagerPersistedState, setNluManagerPersistedState] = useSessionStorageState<NLUPersistedState>(
    `${NLU_MANAGER_PERSISTED_STATE_KEY}-${activeProjectID}`,
    { id: null, tab: InteractionModelTabType.INTENTS }
  );

  const persistedStateRef = useCachedValue(nluManagerPersistedState);

  const activeTab = modelMatch?.params.modelType ?? persistedStateRef.current.tab ?? InteractionModelTabType.INTENTS;
  const activeItemID = modelMatch?.params.modelEntityID ? decodeURIComponent(modelMatch.params.modelEntityID) : persistedStateRef.current.id ?? '';

  const items = activeTabSelector(activeTab, {
    [InteractionModelTabType.SLOTS]: () => entities,
    [InteractionModelTabType.INTENTS]: () => nluIntents,
    [InteractionModelTabType.VARIABLES]: () => variables,
  })!;

  const tabItemsMap = {
    [InteractionModelTabType.SLOTS]: entities,
    [InteractionModelTabType.INTENTS]: nluIntents,
    [InteractionModelTabType.VARIABLES]: variables,
  };

  const itemsMap = React.useMemo(() => Utils.array.createMap(Utils.array.inferUnion(items), (item) => item.id), [items]);

  const goToTab = React.useCallback(
    (tab: InteractionModelTabType, itemID?: string | null) => {
      const persistedState = { tab, id: itemID };
      trackingEvents.trackNLUManagerNavigation({ tab });

      persistedStateRef.current = persistedState;

      setNluManagerPersistedState(persistedState);
      goToNLUManagerEntity(tab, itemID);

      if (!itemID) {
        closeEditorTab();
      }
    },
    [activeTab, goToNLUManagerEntity, setNluManagerPersistedState, closeEditorTab]
  );

  const goToItem = React.useCallback(
    (itemID: string | null) => {
      if (activeItemID === itemID) return;

      goToTab(activeTab, itemID);
    },
    [goToTab, activeTab, activeItemID]
  );

  const toggleActiveItemID = React.useCallback(
    (id?: string) => {
      if (!id) {
        goToItem(null);
        return;
      }

      goToItem(activeItemID === id ? null : id);
    },
    [activeItemID, goToItem]
  );

  const createAndGoToItem = React.useCallback(
    (name?: string) => {
      activeTabSelector(activeTab, {
        [InteractionModelTabType.SLOTS]: () => addSlotModal.open({ name, onCreate: (slot: Realtime.Slot) => goToItem(slot.id) }),
        [InteractionModelTabType.INTENTS]: () => addIntentModal.open({ name, onCreate: (id: string) => goToItem(id) }),
        [InteractionModelTabType.VARIABLES]: () => addVariableModal.open({ name, onCreate: (slot: Realtime.Slot) => goToItem(slot.id) }),
      });
    },
    [activeTab, addVariableModal, addIntentModal, addSlotModal, goToItem]
  );

  const setSelectedItemIDs = React.useCallback(
    (ids: string[] | ((ids: string[], set: Set<string>) => string[])) => {
      if (Array.isArray(ids)) {
        setSelectedItemIDsSet(new Set(ids));
      } else {
        setSelectedItemIDsSet((selectedItemIDs) => new Set(ids(Array.from(selectedItemIDs), selectedItemIDs)));
      }
    },
    [setSelectedItemIDsSet]
  );

  const deleteItem = React.useCallback(
    async (id: string) => {
      if (!nlu.canDeleteItem(id, activeTab)) {
        toast.error(`Cannot delete item`);
        return;
      }

      await nlu.deleteItem(id, activeTab);

      setSelectedItemIDs((selectedItemIDs) => Utils.array.withoutValue(selectedItemIDs, id));

      if (id === activeItemID) {
        goToItem(null);
      }
    },
    [goToItem, activeTab, activeItemID, nlu.canDeleteItem, nlu.deleteItem]
  );

  const deleteSelectedItems = React.useCallback(async () => {
    const deletedItemIDs = await nlu.deleteItems(Array.from(selectedItemIDs), activeTab);

    if (!deletedItemIDs.length) {
      toast.error(`Cannot delete these items`);
      return;
    }

    setSelectedItemIDs(Utils.array.withoutValues(Array.from(selectedItemIDs), deletedItemIDs));

    toast.success(`Deleted ${deletedItemIDs.length} items`);

    if (deletedItemIDs.includes(activeItemID)) {
      goToItem(null);
    }
  }, [activeTab, selectedItemIDs, activeItemID, deleteItem, deleteItem]);

  const toggleSelectedItemID = React.useCallback((itemID: string) => {
    setSelectedItemIDs((selectedItemIDs, selectedItemIDsSet) =>
      selectedItemIDsSet.has(itemID) ? Utils.array.withoutValue(selectedItemIDs, itemID) : [...selectedItemIDs, itemID]
    );
  }, []);

  useDidUpdateEffect(() => {
    setSearch('');
    setSelectedItemIDs([]);
  }, [activeTab]);

  useDidUpdateEffect(() => {
    setRenamingItemID(null);
    closeEditorTab();
  }, [activeItemID]);

  const api = useContextApi<NLUManagerContextValue>({
    items,
    search,
    goToTab,
    itemsMap,
    goToItem,
    setSearch,
    activeTab,
    deleteItem,
    activeItem: itemsMap[activeItemID] ?? null,
    tabItemsMap,
    activeItemID,
    renamingItemID,
    selectedItemIDs,
    createAndGoToItem,
    setRenamingItemID,
    setSelectedItemIDs,
    toggleActiveItemID,
    deleteSelectedItems,
    toggleSelectedItemID,
    isEditorTabActive,
    openEditorTab,
    closeEditorTab,
    isScrolling,
    setIsScrolling,
    inFullScreenTab,
    clarity,
    notifications,
    fetchClarity,
    isFetchingClarity,
  });

  return <NLUManagerContext.Provider value={api}>{children}</NLUManagerContext.Provider>;
};

export const useNLUManager = <I extends AnyItem>(): NLUManagerContextValue<I> => React.useContext(NLUManagerContext) as NLUManagerContextValue<I>;
