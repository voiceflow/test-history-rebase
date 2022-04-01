import { Utils } from '@voiceflow/common';
import { toast, useCachedValue, useContextApi, useDidUpdateEffect, useSessionStorageState } from '@voiceflow/ui';
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
import { useDispatch, useForceUpdate, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { IMM_PERSISTED_STATE_KEY } from '@/pages/Canvas/components/InteractionModelModal';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
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
  nameChangeTransform: (name: string, tab: InteractionModelTabType) => string;
  canRenameItem: (id: string, type: InteractionModelTabType) => boolean;
  canDeleteItem: (id: string, type: InteractionModelTabType) => boolean;
  triggerNewInlineIntent: () => void;
  forceNewInlineIntent: number;
  triggerNewInlineEntity: () => void;
  forceNewInlineEntity: number;
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
  canRenameItem: () => true,
  canDeleteItem: () => false,
  triggerNewInlineIntent: Utils.functional.noop,
  forceNewInlineIntent: 0,
  triggerNewInlineEntity: () => Utils.functional.noop,
  forceNewInlineEntity: 0,
};

export const NLUQuickViewContext = React.createContext<NLUQuickViewProps>(DefaultState);

export const NLUQuickViewProvider: React.FC = ({ children }) => {
  const [title, setTitle] = React.useState('');
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);
  const activeProjectID = useSelector(activeProjectIDSelector)!;

  const [triggerNewInlineIntent, forceNewInlineIntent] = useForceUpdate();
  const [triggerNewInlineEntity, forceNewInlineEntity] = useForceUpdate();

  const { isInStack, isOpened, open, close } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const [trackingEvents] = useTrackingEvents();

  const location = useLocation();

  const patchSlot = useDispatch(SlotDuck.patchSlot);
  const patchIntent = useDispatch(Intent.patchIntent);
  const goToQuickviewModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);
  const goToQuickviewTab = useDispatch(Router.goToCurrentCanvasInteractionModel);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const { sortedIntents } = useOrderedIntents();
  const { sortedSlots } = useOrderedEntities();
  const { mergedVariables, mergedVariablesMap } = useOrderedVariables();

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

  const onRenameIntent = React.useCallback(
    (newName: string, id: string) => {
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
    },
    [validateNewIntentName]
  );

  const onRenameSlot = React.useCallback(
    (slotName: string, id: string) => {
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

      // TODO: after release, remove this check in the validateSlotName, and remove this condition
      if (error === 'Custom entity needs at least one value') {
        toast.warn(error);
      } else if (error) {
        toast.error(error);
        return;
      }

      patchSlot?.(id, {
        name: formattedSlotName,
      });
    },
    [allSlotsMap, allSlots, allCustomIntents]
  );

  const onNameChange = React.useCallback(
    (name: string, id: string) => {
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
    },
    [activeTab, onRenameSlot, onRenameIntent]
  );

  const nameChangeTransform = React.useCallback((name: string, tab: InteractionModelTabType) => {
    switch (tab) {
      case InteractionModelTabType.INTENTS:
        return applyPlatformIntentNameFormatting(name, platform);
      case InteractionModelTabType.SLOTS:
        return formatIntentAndSlotName(name);
      default:
        return name;
    }
  }, []);

  const canRenameItem = React.useCallback(
    (id: string, type: InteractionModelTabType) => {
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (type) {
        case InteractionModelTabType.INTENTS:
          return canRenameIntent(id);
          break;
        case InteractionModelTabType.VARIABLES:
          return false;
          break;
        default:
          return true;
          break;
      }
    },
    [canRenameIntent]
  );

  const canDeleteVariable = React.useCallback(
    (id: string) => {
      return mergedVariablesMap[id]?.type !== VariableType.BUILT_IN;
    },
    [mergedVariablesMap]
  );

  const canDeleteIntent = (id: string) => {
    return !isBuiltInIntent(id);
  };

  const canDeleteItem = React.useCallback(
    (id: string, type: InteractionModelTabType) => {
      switch (type) {
        case InteractionModelTabType.INTENTS:
          return canDeleteIntent(id);
          break;
        case InteractionModelTabType.VARIABLES:
          return canDeleteVariable(id);
          break;
        default:
          return true;
          break;
      }
    },
    [canDeleteVariable]
  );

  const handleSetPersistState = (tab: InteractionModelTabType, id: string | null) => {
    const persistedState = { tab, id };
    setIMMPersistedState(persistedState);
    persistedStateRef.current = persistedState;
  };

  const goToEntity = (tab: InteractionModelTabType, id: string) => {
    handleSetPersistState(tab, id);
    if (id) {
      goToQuickviewModelEntity(tab, id);
    } else {
      goToQuickviewTab(tab);
    }
  };

  const setSelectedTab = React.useCallback(
    (tab: InteractionModelTabType) => {
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
      if (firstItemID) {
        goToEntity(tab, firstItemID);
      } else {
        goToQuickviewTab(tab);
      }

      trackingEvents.trackIMMNavigation({ tabName: tab });
    },
    [sortedIntents, sortedSlots, mergedVariables, goToEntity]
  );

  const setSelectedID = React.useCallback(
    (id: string) => {
      goToEntity(activeTab, id);
    },
    [activeTab, goToEntity]
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
      goToCurrentCanvas();
    }
  }, [isOpened, isInStack]);

  const api: NLUQuickViewProps = useContextApi({
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
    canRenameItem,
    canDeleteItem,
    triggerNewInlineIntent,
    forceNewInlineIntent,
    triggerNewInlineEntity,
    forceNewInlineEntity,
  });

  return <NLUQuickViewContext.Provider value={api}>{children}</NLUQuickViewContext.Provider>;
};
