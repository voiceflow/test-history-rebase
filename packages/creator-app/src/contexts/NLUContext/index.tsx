import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useContextApi } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { CUSTOM_SLOT_TYPE, InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';
import { VariableType } from '@/pages/Canvas/components/InteractionModelModal/components/VariablesManager/constants';
import { useDeleteVariable, useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import { generateSlotInput } from '@/pages/Canvas/components/SlotEdit/utils';
import { applyPlatformIntentAndSlotNameFormatting, isBuiltInIntent, validateIntentName } from '@/utils/intent';
import { validateSlotName } from '@/utils/slot';

interface NLUProps {
  nameChangeTransform: (name: string, tab: InteractionModelTabType) => string;
  canRenameItem: (id: string, type: InteractionModelTabType) => boolean;
  renameItem: (newName: string, id: string, type: InteractionModelTabType) => void;
  canDeleteItem: (id: string, type: InteractionModelTabType) => boolean;
  deleteItem: (id: string, tab: InteractionModelTabType) => void;
  deleteItems: (ids: string[], tab: InteractionModelTabType) => Promise<string[]>;
  generateItemName: (type: InteractionModelTabType) => string;
}

const DefaultState = {
  nameChangeTransform: (name: string) => name,
  canRenameItem: () => true,
  renameItem: Utils.functional.noop,
  canDeleteItem: () => false,
  deleteItem: Utils.functional.noop,
  deleteItems: async () => [],
  generateItemName: () => '',
};

export const NLUContext = React.createContext<NLUProps>(DefaultState);

export const NLUProvider: React.FC = ({ children }) => {
  const patchSlot = useDispatch(Slot.patchSlot);
  const patchIntent = useDispatch(Intent.patchIntent);
  const deleteIntent = useDispatch(Intent.deleteIntent);
  const deleteIntents = useDispatch(Intent.deleteManyIntents);
  const deleteSlot = useDispatch(Slot.deleteSlot);
  const deleteSlots = useDispatch(Slot.deleteSlots);
  const deleteVariable = useDeleteVariable();
  const removeIntentSlot = useDispatch(Intent.removeIntentSlot);
  const removeGlobalVariables = useDispatch(Version.removeGlobalVariables);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);

  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);

  const { mergedVariablesMap } = useOrderedVariables();

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

  const canDeleteVariable = React.useCallback(
    (id: string) => {
      return mergedVariablesMap[id]?.type !== VariableType.BUILT_IN;
    },
    [mergedVariablesMap]
  );

  const handleSlotDelete = (slotID: string) => {
    const activeIntents = getIntentsUsingSlot({ id: slotID });

    if (activeIntents.length > 0) {
      activeIntents.forEach((intent) => removeIntentSlot(intent.id, slotID));
      toast.info('Utterances containing this entity have been modified to remove the slot reference.');
    }
    deleteSlot(slotID);
  };

  const itemActions = React.useMemo(() => {
    return {
      [InteractionModelTabType.INTENTS]: {
        rename: (name: string, id: string) => onRenameIntent(name, id),
        transformName: (name: string, platform: VoiceflowConstants.PlatformType) => applyPlatformIntentAndSlotNameFormatting(name, platform),
        canRename: (id: string) => canRenameIntent(id),
        canDelete: () => true,
        delete: (id: string) => deleteIntent(id),
        generateName: () => {
          const numberWord = Utils.number.convertToWord(allCustomIntents.length);
          if (Realtime.Utils.typeGuards.isAlexaOrGooglePlatform(platform)) {
            return `intent_${numberWord}`;
          }
          return `Intent ${numberWord}`;
        },
      },
      [InteractionModelTabType.SLOTS]: {
        rename: (name: string, id: string) => onRenameSlot(name, id),
        transformName: (name: string) => applyPlatformIntentAndSlotNameFormatting(name, platform),
        canRename: () => true,
        canDelete: () => true,
        delete: (id: string) => handleSlotDelete(id),
        generateName: () => {
          const numberWord = Utils.number.convertToWord(allSlots.length);
          if (Realtime.Utils.typeGuards.isAlexaOrGooglePlatform(platform)) {
            return `entity_${numberWord}`;
          }
          return `Entity ${numberWord}`;
        },
      },
      [InteractionModelTabType.VARIABLES]: {
        rename: Utils.functional.noop,
        transformName: (name: string) => name,
        canRename: () => false,
        canDelete: (id: string) => canDeleteVariable(id),
        delete: (id: string) => deleteVariable(id),
        // We shouldn't use this, because we can't change variable names, but it's here if needed
        generateName: () => Utils.id.cuid(),
      },
    };
  }, [allSlots, platform, onRenameIntent, onRenameSlot, canRenameIntent, canDeleteVariable, deleteIntent, handleSlotDelete, deleteVariable]);

  const renameItem = React.useCallback(
    (name: string, id: string, type: InteractionModelTabType) => {
      itemActions[type].rename(name, id);
    },
    [itemActions]
  );

  const nameChangeTransform = React.useCallback(
    (name: string, tab: InteractionModelTabType) => {
      return itemActions[tab].transformName(name, platform);
    },
    [itemActions]
  );

  const canRenameItem = React.useCallback(
    (id: string, type: InteractionModelTabType) => {
      return itemActions[type].canRename(id);
    },
    [itemActions]
  );

  const canDeleteItem = React.useCallback(
    (id: string, type: InteractionModelTabType) => {
      return itemActions[type].canDelete(id);
    },
    [itemActions]
  );

  const deleteItem = React.useCallback(
    (itemID: string, type: InteractionModelTabType) => {
      itemActions[type].delete(itemID);
    },
    [itemActions]
  );

  const deleteItems = React.useCallback(
    async (itemIDs: string[], type: InteractionModelTabType) => {
      // TODO Multi item delete realtime actions
      const validDeleteIDs: string[] = [];
      itemIDs.forEach((id) => {
        if (canDeleteItem(id, type)) {
          validDeleteIDs.push(id);
        }
      });

      if (type === InteractionModelTabType.INTENTS) {
        await deleteIntents(validDeleteIDs);
      } else if (type === InteractionModelTabType.SLOTS) {
        await deleteSlots(validDeleteIDs);
      } else if (type === InteractionModelTabType.VARIABLES) {
        const cleanedNames = validDeleteIDs.map((name) => name.replace(`${VariableType.GLOBAL}:`, ''));
        await removeGlobalVariables(cleanedNames);
      }

      return validDeleteIDs;
    },
    [canDeleteItem]
  );

  const generateItemName = (type: InteractionModelTabType) => {
    return itemActions[type].generateName();
  };

  const api: NLUProps = useContextApi({
    renameItem,
    nameChangeTransform,
    canRenameItem,
    canDeleteItem,
    deleteItem,
    deleteItems,
    generateItemName,
  });

  return <NLUContext.Provider value={api}>{children}</NLUContext.Provider>;
};
