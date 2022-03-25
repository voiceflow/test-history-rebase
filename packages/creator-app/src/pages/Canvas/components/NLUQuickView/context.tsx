import { Utils } from '@voiceflow/common';
import { toast, useCachedValue, useDidUpdateEffect, useSessionStorageState } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { CUSTOM_SLOT_TYPE, InteractionModelTabType, ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/session';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { IMM_PERSISTED_STATE_KEY } from '@/pages/Canvas/components/InteractionModelModal';
import { useOrderedEntities, useOrderedIntents, useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { generateSlotInput } from '@/pages/Canvas/components/SlotEdit/utils';
import { applyPlatformIntentNameFormatting, formatIntentAndSlotName, isBuiltInIntent, validateIntentName } from '@/utils/intent';
import { validateSlotName } from '@/utils/slot';

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
  onRenameIntent: (newName: string, id: string) => void;
  onRenameSlot: (newName: string, id: string) => void;
  nameChangeTransform: (name: string) => string;
  canRenameIntent: (id: string) => boolean;
  canRenameItem: (id?: string) => boolean;
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
  onRenameIntent: Utils.functional.noop,
  onRenameSlot: Utils.functional.noop,
  nameChangeTransform: (name: string) => name,
  canRenameIntent: () => true,
  canRenameItem: () => true,
};

export const NLUQuickViewContext = React.createContext<NLUQuickViewProps>(DefaultState);

export const NLUQuickViewProvider: React.FC = ({ children }) => {
  const [title, setTitle] = React.useState('');
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);
  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const { isInStack, isOpened, open, close } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const [trackingEvents] = useTrackingEvents();

  const location = useLocation();

  const patchSlot = useDispatch(SlotDuck.patchSlot);
  const patchIntent = useDispatch(Intent.patchIntent);
  const goToQuickviewModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const { sortedSlots } = useOrderedEntities();
  const { sortedIntents } = useOrderedIntents();
  const { mergedVariables } = useOrderedVariables();

  const [immPersistedState, setIMMPersistedState] = useSessionStorageState<{ tab: InteractionModelTabType; id: string | null }>(
    `${IMM_PERSISTED_STATE_KEY}-${activeProjectID}`,
    {
      tab: InteractionModelTabType.INTENTS,
      id: null,
    }
  );

  const persistedStateRef = useCachedValue(immPersistedState);

  const modelMatch = React.useMemo(() => {
    return matchPath<{ modelType: InteractionModelTabType; modelEntityID?: string }>(location.pathname, {
      path: [Path.CANVAS_MODEL_ENTITY, Path.CANVAS_MODEL],
    });
  }, [location.pathname]);

  const activeTab = modelMatch?.params.modelType ?? InteractionModelTabType.INTENTS;
  const activeID = modelMatch?.params.modelEntityID ? decodeURIComponent(modelMatch.params.modelEntityID) : '';

  const validateNewIntentName = React.useCallback(
    (intentName: string, id: string) =>
      validateIntentName(
        intentName ?? '',
        allCustomIntents.filter((intent) => intent.id !== id),
        allSlots
      ),
    [allCustomIntents, allSlots]
  );

  const canRenameIntent = (id: string) => {
    return !isBuiltInIntent(id);
  };

  const onRenameIntent = (newName: string, id: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(newName);
    const error = validateNewIntentName(formattedName, id);

    if (!canRenameIntent(id)) {
      toast.error('Cannot rename built-in intent');
      return;
    }
    if (error) {
      toast.error(error);
      return;
    }

    patchIntent(id, { id, name: formattedName });
  };

  const onRenameSlot = (slotName: string, id: string) => {
    const formattedSlotName = Utils.string.removeTrailingUnderscores(slotName);

    const slot = allSlotsMap[id];

    const { inputs } = slot;
    const customLines = inputs?.length ? inputs : (slot.type === CUSTOM_SLOT_TYPE && [generateSlotInput()]) || inputs;
    const notEmptyValues = customLines.some(({ value, synonyms }) => value.trim() || synonyms.trim());

    const error = validateSlotName({
      slots: allSlots.filter((slot) => slot.id !== id),
      intents: allCustomIntents,
      slotName: formattedSlotName,
      slotType: slot.type!,
      notEmptyValues,
    });

    if (error) {
      toast.error(error);
      return;
    }

    patchSlot?.(id, {
      name: formattedSlotName,
    });
  };

  const onNameChange = (name: string, id: string) => {
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        onRenameIntent(name, id);
        break;
      case InteractionModelTabType.SLOTS:
        onRenameSlot(name, id);
        break;
      default:
        break;
    }
  };

  const nameChangeTransform = (name: string) => {
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        return applyPlatformIntentNameFormatting(name, platform);
      case InteractionModelTabType.SLOTS:
        return formatIntentAndSlotName(name);
      default:
        return name;
    }
  };

  const canRenameItem = (id?: string) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        return canRenameIntent(id || activeID);
        break;
      case InteractionModelTabType.VARIABLES:
        return false;
        break;
      default:
        return true;
        break;
    }
  };

  const handleSetPersistState = (tab: InteractionModelTabType, id: string | null) => {
    const persistedState = { tab, id };
    setIMMPersistedState(persistedState);
    persistedStateRef.current = persistedState;
  };

  const goToEntity = (tab: InteractionModelTabType, id: string) => {
    handleSetPersistState(tab, id);
    goToQuickviewModelEntity(tab, id);
  };

  const setSelectedTab = (tab: InteractionModelTabType) => {
    let firstItemID = '';
    switch (tab) {
      case InteractionModelTabType.INTENTS:
        firstItemID = sortedIntents[0]?.id ?? '';
        break;
      case InteractionModelTabType.SLOTS:
        firstItemID = sortedSlots[0]?.id ?? '';
        break;
      case InteractionModelTabType.VARIABLES:
        firstItemID = mergedVariables[0]?.id ?? '';
        break;
      default:
        break;
    }
    goToEntity(tab, firstItemID);

    trackingEvents.trackIMMNavigation({ tabName: tab });
  };

  const setSelectedID = React.useCallback(
    (id: string) => {
      goToEntity(activeTab, id);
    },
    [activeTab]
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
      }
    } else if (!isInStack && modelMatch) {
      goToCurrentCanvas();
    }
  }, [isOpened, isInStack]);

  const value: NLUQuickViewProps = {
    activeTab,
    setActiveTab: setSelectedTab,
    selectedID: activeID,
    setSelectedID,
    title,
    setTitle,
    isActiveItemRename,
    setIsActiveItemRename,
    onNameChange,
    onRenameIntent,
    onRenameSlot,
    nameChangeTransform,
    canRenameIntent,
    canRenameItem,
  };

  return <NLUQuickViewContext.Provider value={value}>{children}</NLUQuickViewContext.Provider>;
};
