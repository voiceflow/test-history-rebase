import { Utils } from '@voiceflow/common';
import { useCachedValue, useContextApi, useForceUpdate, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';
import { Designer } from '@/ducks';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import { useOrderedIntents } from '@/hooks/intent.hook';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { useOrderedVariables } from '@/hooks/variable';

export const IMM_PERSISTED_STATE_KEY = 'IMM_PERSIST_KEY';

interface NLUQuickViewProps {
  title: string;
  setTitle: (title: string) => void;
  urlSynced: boolean;
  activeTab: InteractionModelTabType;
  deleteItem: (id: string, tab?: InteractionModelTabType) => void;
  selectedID: string;
  onNameChange: (name: string, id: string) => void;
  setActiveTab: (tab: InteractionModelTabType) => void;
  setSelectedID: (id: string) => void;
  canRenameItem: (id: string, type: InteractionModelTabType) => boolean;
  canDeleteItem: (id: string, type: InteractionModelTabType) => boolean;
  isCreatingItem: boolean;
  setIsCreatingItem: (val: boolean) => void;
  isActiveItemRename: boolean;
  nameChangeTransform: (name: string, tab: InteractionModelTabType) => string;
  onEnterEntityPrompt: (slotID: string, options?: { autogenerate?: boolean }) => void;
  forceNewInlineIntent: number;
  forceNewInlineEntity: number;
  setIsActiveItemRename: (val: boolean) => void;
  triggerNewInlineIntent: () => void;
  triggerNewInlineEntity: () => void;
  intentEntityPromptSlotID: string;
  onIntentEntityPromptBack: VoidFunction;
  intentEntityPromptAutogenerate: boolean;
}

const DEFAULT_STATE: NLUQuickViewProps = {
  title: '',
  setTitle: Utils.functional.noop,
  activeTab: InteractionModelTabType.VARIABLES,
  urlSynced: false,
  selectedID: '',
  deleteItem: Utils.functional.noop,
  setActiveTab: Utils.functional.noop,
  onNameChange: Utils.functional.noop,
  setSelectedID: Utils.functional.noop,
  canRenameItem: () => true,
  canDeleteItem: () => false,
  isCreatingItem: false,
  setIsCreatingItem: Utils.functional.noop,
  isActiveItemRename: false,
  onEnterEntityPrompt: Utils.functional.noop,
  nameChangeTransform: (name: string) => name,
  forceNewInlineIntent: 0,
  forceNewInlineEntity: 0,
  setIsActiveItemRename: Utils.functional.noop,
  triggerNewInlineIntent: Utils.functional.noop,
  triggerNewInlineEntity: () => Utils.functional.noop,
  intentEntityPromptSlotID: '',
  onIntentEntityPromptBack: Utils.functional.noop,
  intentEntityPromptAutogenerate: false,
};

export const NLUQuickViewContext = React.createContext<NLUQuickViewProps>(DEFAULT_STATE);

export const NLUQuickViewProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [title, setTitle] = React.useState('');
  const [isCreatingItem, setIsCreatingItem] = React.useState(false);
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);
  const [intentEntityPromptSlotID, setIntentEntityPromptSlotID] = React.useState('');
  const [intentEntityPromptAutogenerate, setIntentEntityPromptAutogenerate] = React.useState(false);

  const [triggerNewInlineIntent, forceNewInlineIntent] = useForceUpdate();
  const [triggerNewInlineEntity, forceNewInlineEntity] = useForceUpdate();

  const [trackingEvents] = useTrackingEvents();

  const location = useLocation();

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const goToNLUQuickView = useDispatch(Router.goToNLUQuickView);
  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity);

  const { renameItem, deleteItem: deleteNLUItem, canDeleteItem, canRenameItem, nameChangeTransform } = React.useContext(NLUContext);

  const sortedSlots = useSelector(Designer.Entity.selectors.allOrderedByName);
  const sortedIntents = useOrderedIntents();
  const [sortedVariables] = useOrderedVariables();

  const [immPersistedState, setIMMPersistedState] = useSessionStorageState<{ tab: InteractionModelTabType; id: string | null }>(
    `${IMM_PERSISTED_STATE_KEY}-${activeProjectID}`,
    {
      tab: InteractionModelTabType.VARIABLES,
      id: null,
    }
  );

  const persistedStateRef = useCachedValue(immPersistedState);

  const modelMatch = React.useMemo(
    () =>
      matchPath<{ modelType: InteractionModelTabType; modelEntityID?: string }>(location.pathname, {
        path: [Path.CANVAS_MODEL_ENTITY, Path.CANVAS_MODEL],
      }),
    [location.pathname]
  );

  const activeTab = InteractionModelTabType.VARIABLES;
  const activeID = modelMatch?.params.modelEntityID ? decodeURIComponent(modelMatch.params.modelEntityID) : '';

  const onNameChange = React.useCallback((name: string, id: string) => renameItem(name, id, activeTab), [activeTab, renameItem]);

  const goToEntity = React.useCallback(
    (tab: InteractionModelTabType, id: string) => {
      const persistedState = { tab, id };

      setIMMPersistedState(persistedState);

      persistedStateRef.current = persistedState;

      if (id) {
        goToNLUQuickViewEntity(tab, id);
      } else {
        goToNLUQuickView(tab);
      }
    },
    [setIMMPersistedState]
  );

  const setSelectedTab = React.useCallback(
    (tab: InteractionModelTabType, deletedID?: string) => {
      let targetID = '';
      const targetArray: { id: string }[] = sortedVariables || [];

      targetID = (targetArray[0]?.id === deletedID ? targetArray[1]?.id : targetArray[0]?.id) || '';

      if (targetID) {
        goToEntity(tab, targetID);
      } else {
        goToNLUQuickView(tab);
      }

      setIntentEntityPromptSlotID('');
      setIntentEntityPromptAutogenerate(false);
      trackingEvents.trackIMMNavigation({ tabName: tab });
    },
    [sortedIntents, sortedSlots, sortedVariables, goToEntity]
  );

  const setSelectedID = React.useCallback(
    (id: string) => {
      goToEntity(activeTab, id);
      setIntentEntityPromptSlotID('');
      setIntentEntityPromptAutogenerate(false);
    },
    [activeTab, goToEntity]
  );

  const onEnterEntityPrompt = React.useCallback((slotID: string, { autogenerate = false }: { autogenerate?: boolean } = {}) => {
    setIntentEntityPromptSlotID(slotID);
    setIntentEntityPromptAutogenerate(autogenerate);
  }, []);

  const onIntentEntityPromptBack = React.useCallback(() => {
    setIntentEntityPromptSlotID('');
    setIntentEntityPromptAutogenerate(false);
  }, []);

  const deleteItem = React.useCallback(
    (itemID: string, tab?: InteractionModelTabType) => {
      const targetTab = tab || activeTab;

      deleteNLUItem(itemID, targetTab);

      setSelectedTab(InteractionModelTabType.VARIABLES, itemID);
    },
    [activeTab, setSelectedTab, deleteNLUItem]
  );

  React.useEffect(() => {
    if (modelMatch?.params.modelType) return;

    const persistedState = persistedStateRef.current;
    const { tab: persistedTab, id: persistedID } = persistedState;

    if (persistedTab && persistedID) {
      goToNLUQuickViewEntity(persistedTab, persistedID);
    } else {
      goToNLUQuickView(InteractionModelTabType.VARIABLES);
    }
  }, []);

  const api: NLUQuickViewProps = useContextApi({
    title,
    setTitle,
    urlSynced: !!modelMatch?.params.modelType,
    activeTab,
    selectedID: activeID,
    deleteItem,
    onNameChange,
    setActiveTab: setSelectedTab,
    setSelectedID,
    canRenameItem,
    canDeleteItem,
    isCreatingItem,
    setIsCreatingItem,
    isActiveItemRename,
    onEnterEntityPrompt,
    nameChangeTransform,
    forceNewInlineIntent,
    forceNewInlineEntity,
    setIsActiveItemRename,
    triggerNewInlineIntent,
    triggerNewInlineEntity,
    intentEntityPromptSlotID,
    onIntentEntityPromptBack,
    intentEntityPromptAutogenerate,
  });

  return <NLUQuickViewContext.Provider value={api}>{children}</NLUQuickViewContext.Provider>;
};
