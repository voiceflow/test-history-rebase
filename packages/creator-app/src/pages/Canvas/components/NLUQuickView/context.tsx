import { Utils } from '@voiceflow/common';
import { useCachedValue, useContextApi, useDidUpdateEffect, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { InteractionModelTabType, ModalType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import {
  useDispatch,
  useForceUpdate,
  useModals,
  useOrderedEntities,
  useOrderedIntents,
  useOrderedVariables,
  useSelector,
  useTrackingEvents,
} from '@/hooks';

export const IMM_PERSISTED_STATE_KEY = 'IMM_PERSIST_KEY';

interface NLUQuickViewProps {
  activeTab: InteractionModelTabType;
  setActiveTab: (tab: InteractionModelTabType) => void;
  selectedID: string;
  setSelectedID: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isActiveItemRename: boolean;
  setIsActiveItemRename: (val: boolean) => void;
  onNameChange: (name: string, id: string) => void;
  nameChangeTransform: (name: string, tab: InteractionModelTabType) => string;
  canRenameItem: (id: string, type: InteractionModelTabType) => boolean;
  canDeleteItem: (id: string, type: InteractionModelTabType) => boolean;
  triggerNewInlineIntent: () => void;
  forceNewInlineIntent: number;
  triggerNewInlineEntity: () => void;
  forceNewInlineEntity: number;
  isCreatingItem: boolean;
  setIsCreatingItem: (val: boolean) => void;
  deleteItem: (id: string, tab?: InteractionModelTabType) => void;
  intentEntityPromptSlotID: string;
  intentEntityPromptAutogenerate: boolean;
  onEnterEntityPrompt: (slotID: string, options?: { autogenerate?: boolean }) => void;
  onIntentEntityPromptBack: VoidFunction;
}

const DefaultState = {
  activeTab: InteractionModelTabType.INTENTS,
  setActiveTab: Utils.functional.noop,
  selectedID: '',
  setSelectedID: Utils.functional.noop,
  title: '',
  setTitle: Utils.functional.noop,
  isActiveItemRename: false,
  setIsActiveItemRename: Utils.functional.noop,
  onNameChange: Utils.functional.noop,
  nameChangeTransform: (name: string) => name,
  canRenameItem: () => true,
  canDeleteItem: () => false,
  triggerNewInlineIntent: Utils.functional.noop,
  forceNewInlineIntent: 0,
  triggerNewInlineEntity: () => Utils.functional.noop,
  forceNewInlineEntity: 0,
  isCreatingItem: false,
  setIsCreatingItem: Utils.functional.noop,
  deleteItem: Utils.functional.noop,
  intentEntityPromptSlotID: '',
  intentEntityPromptAutogenerate: false,
  onEnterEntityPrompt: Utils.functional.noop,
  onIntentEntityPromptBack: Utils.functional.noop,
};

export const NLUQuickViewContext = React.createContext<NLUQuickViewProps>(DefaultState);

export const NLUQuickViewProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [title, setTitle] = React.useState('');
  const [isCreatingItem, setIsCreatingItem] = React.useState(false);
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);
  const [intentEntityPromptSlotID, setIntentEntityPromptSlotID] = React.useState('');
  const [intentEntityPromptAutogenerate, setIntentEntityPromptAutogenerate] = React.useState(false);

  const [triggerNewInlineIntent, forceNewInlineIntent] = useForceUpdate();
  const [triggerNewInlineEntity, forceNewInlineEntity] = useForceUpdate();

  const { isInStack, isOpened, open, close } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const [trackingEvents] = useTrackingEvents();

  const location = useLocation();

  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const goToQuickviewTab = useDispatch(Router.goToCurrentCanvasInteractionModel);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToCurrentCanvasNode = useDispatch(Router.goToCurrentCanvasNode);
  const goToQuickviewModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const creatorFocus = useSelector(Creator.creatorFocusSelector);

  const { renameItem, deleteItem: deleteNLUItem, canDeleteItem, canRenameItem, nameChangeTransform } = React.useContext(NLUContext);

  const sortedSlots = useOrderedEntities();
  const sortedIntents = useOrderedIntents();
  const [sortedVariables] = useOrderedVariables();

  const [immPersistedState, setIMMPersistedState] = useSessionStorageState<{ tab: InteractionModelTabType; id: string | null }>(
    `${IMM_PERSISTED_STATE_KEY}-${activeProjectID}`,
    {
      tab: InteractionModelTabType.INTENTS,
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

  const activeTab = modelMatch?.params.modelType ?? InteractionModelTabType.INTENTS;

  const activeID = modelMatch?.params.modelEntityID ? decodeURIComponent(modelMatch.params.modelEntityID) : '';

  const onNameChange = React.useCallback((name: string, id: string) => renameItem(name, id, activeTab), [activeTab, renameItem]);

  const goToEntity = React.useCallback(
    (tab: InteractionModelTabType, id: string) => {
      const persistedState = { tab, id };

      setIMMPersistedState(persistedState);

      persistedStateRef.current = persistedState;

      if (id) {
        goToQuickviewModelEntity(tab, id);
      } else {
        goToQuickviewTab(tab);
      }
    },
    [setIMMPersistedState, goToQuickviewModelEntity, goToQuickviewTab]
  );

  const setSelectedTab = React.useCallback(
    (tab: InteractionModelTabType, deletedID?: string) => {
      let targetID = '';
      let targetArray: { id: string }[] = [];

      switch (tab) {
        case InteractionModelTabType.INTENTS:
          targetArray = sortedIntents;
          break;
        case InteractionModelTabType.SLOTS:
          targetArray = sortedSlots;
          break;
        case InteractionModelTabType.VARIABLES:
          targetArray = sortedVariables;
          break;
        default:
          break;
      }

      targetID = (targetArray[0]?.id === deletedID ? targetArray[1]?.id : targetArray[0]?.id) || '';

      if (targetID) {
        goToEntity(tab, targetID);
      } else {
        goToQuickviewTab(tab);
      }

      setIntentEntityPromptSlotID('');
      setIntentEntityPromptAutogenerate(false);
      trackingEvents.trackIMMNavigation({ tabName: tab });
    },
    [sortedIntents, sortedSlots, sortedVariables, goToEntity, goToQuickviewTab]
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

      switch (targetTab) {
        case InteractionModelTabType.INTENTS:
          setSelectedTab(InteractionModelTabType.INTENTS, itemID);
          break;
        case InteractionModelTabType.SLOTS:
          setSelectedTab(InteractionModelTabType.SLOTS, itemID);
          break;
        case InteractionModelTabType.VARIABLES:
          setSelectedTab(InteractionModelTabType.VARIABLES, itemID);
          break;
        default:
          break;
      }
    },
    [activeTab, setSelectedTab, deleteNLUItem]
  );

  // When IMM gets opened with a variable click (with a target item)
  React.useEffect(() => {
    if (!!modelMatch && !isInStack) {
      open();
    } else if (!modelMatch && isInStack) {
      close();
    }
  }, [!!modelMatch]);

  useDidUpdateEffect(() => {
    const visibleAndInStack = isInStack && isOpened;

    if (visibleAndInStack && !modelMatch) {
      const persistedState = persistedStateRef.current;
      const { tab: persistedTab, id: persistedID } = persistedState;

      if (persistedTab && persistedID) {
        goToQuickviewModelEntity(persistedTab, persistedID);
      } else if (sortedIntents.length) {
        goToQuickviewModelEntity(InteractionModelTabType.INTENTS, sortedIntents[0].id);
      } else {
        goToQuickviewTab(InteractionModelTabType.INTENTS);
      }
    } else if (!isInStack && modelMatch) {
      if (creatorFocus.target && creatorFocus.isActive) {
        goToCurrentCanvasNode(creatorFocus.target);
      } else {
        goToCurrentCanvas();
      }
    }
  }, [isOpened, isInStack]);

  useDidUpdateEffect(() => {
    if (!isInStack) return;

    setIsActiveItemRename(false);
    setIntentEntityPromptSlotID('');
    setIntentEntityPromptAutogenerate(false);
  }, [isInStack]);

  const api: NLUQuickViewProps = useContextApi({
    title,
    setTitle,
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
