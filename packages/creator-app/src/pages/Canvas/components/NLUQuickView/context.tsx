import { Utils } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import React from 'react';

import { CUSTOM_SLOT_TYPE, InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotDuck from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';
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
  const [activeTab, setActiveTab] = React.useState(InteractionModelTabType.INTENTS);
  const [selectedID, setSelectedID] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [isActiveItemRename, setIsActiveItemRename] = React.useState(false);

  const patchSlot = useDispatch(SlotDuck.patchSlot);
  const patchIntent = useDispatch(Intent.patchIntent);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

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
        return canRenameIntent(id || selectedID);
        break;
      case InteractionModelTabType.VARIABLES:
        return false;
        break;
      default:
        return true;
        break;
    }
  };

  const value: NLUQuickViewProps = {
    activeTab,
    setActiveTab,
    selectedID,
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
