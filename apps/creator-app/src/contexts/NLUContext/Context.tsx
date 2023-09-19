import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import { InteractionModelTabType, VariableType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useDeleteVariable, useDispatch, useIntentNameProcessor, useOrderedVariables, useSelector } from '@/hooks';
import { applyPlatformIntentNameFormatting, isBuiltInIntent } from '@/utils/intent';
import { applySlotNameFormatting, slotNameFormatter, validateSlotName } from '@/utils/slot';

interface NLUContextValue {
  renameItem: (newName: string, id: string, type: InteractionModelTabType) => void;
  deleteItem: (id: string, tab: InteractionModelTabType) => void;
  deleteItems: (ids: string[], tab: InteractionModelTabType) => Promise<string[]>;
  canRenameItem: (id: string, type: InteractionModelTabType) => boolean;
  canDeleteItem: (id: string, type: InteractionModelTabType) => boolean;
  generateItemName: (type: InteractionModelTabType) => string;
  nameChangeTransform: (name: string, tab: InteractionModelTabType) => string;
}

const INITIAL_STATE: NLUContextValue = {
  renameItem: Utils.functional.noop,
  deleteItem: Utils.functional.noop,
  deleteItems: async () => [],
  canRenameItem: () => true,
  canDeleteItem: () => false,
  generateItemName: () => '',
  nameChangeTransform: (name: string) => name,
};

export const NLUContext = React.createContext<NLUContextValue>(INITIAL_STATE);

export const NLUProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const patchSlot = useDispatch(SlotV2.patchSlot);
  const deleteSlot = useDispatch(SlotV2.deleteSlot);
  const deleteSlots = useDispatch(SlotV2.deleteSlots);
  const patchIntent = useDispatch(IntentV2.patchIntent);
  const deleteIntent = useDispatch(IntentV2.deleteIntent);
  const deleteIntents = useDispatch(IntentV2.deleteManyIntents);
  const deleteVariable = useDeleteVariable();
  const removeIntentSlot = useDispatch(IntentV2.removeIntentSlot);
  const removeGlobalVariables = useDispatch(VersionV2.removeGlobalVariables);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const allSlotsMap = useSelector(SlotV2.slotMapSelector);
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const getIntentsUsingSlot = useSelector(IntentV2.getIntentsUsingSlotSelector);

  const intentNameProcessor = useIntentNameProcessor();

  const [, variablesMap] = useOrderedVariables();

  const onRenameIntent = React.useCallback(
    (name: string, id: string) => {
      const { error, formattedName } = intentNameProcessor(name, id);

      if (isBuiltInIntent(id)) {
        toast.error('Cannot rename built-in intent');
        throw new Error('Cannot rename built-in intent');
      }

      if (error) {
        toast.error(error);
        throw new Error(error);
      }

      patchIntent(id, { id, name: formattedName });

      return formattedName;
    },
    [intentNameProcessor]
  );

  const onRenameSlot = React.useCallback(
    (slotName: string, id: string) => {
      const formattedSlotName = slotNameFormatter(platform)(slotName);

      const slot = allSlotsMap[id];

      if (slot.name === formattedSlotName) return;

      const error = validateSlotName({
        slots: allSlots.filter((slot) => slot.id !== id),
        intents: allCustomIntents,
        slotName: formattedSlotName,
        slotType: slot.type!,
      });

      if (error) {
        toast.error(error);
        throw new Error(error);
      }

      patchSlot(id, { name: formattedSlotName }, Tracking.NLUEntityCreationType.IMM);
    },
    [allSlotsMap, allSlots, allCustomIntents]
  );

  const canDeleteVariable = React.useCallback((id: string) => variablesMap[id]?.type !== VariableType.BUILT_IN, [variablesMap]);

  const slotsSize = allSlots.length;
  const intentsSize = allCustomIntents.length;

  const itemActions = React.useMemo(
    () => ({
      [InteractionModelTabType.INTENTS]: {
        rename: (name: string, id: string) => onRenameIntent(name, id),
        delete: (id: string) => deleteIntent(id),
        canRename: (id: string) => !isBuiltInIntent(id),
        canDelete: () => true,
        generateName: (platform: Platform.Constants.PlatformType) => {
          const numberWord = Utils.number.convertToWord(intentsSize + 1);

          return applyPlatformIntentNameFormatting(`Intent ${numberWord}`, platform);
        },
        transformName: (name: string, platform: Platform.Constants.PlatformType) => applyPlatformIntentNameFormatting(name, platform),
      },

      [InteractionModelTabType.SLOTS]: {
        rename: (name: string, id: string) => onRenameSlot(name, id),
        delete: (slotID: string) => {
          const activeIntents = getIntentsUsingSlot({ id: slotID });

          if (activeIntents.length > 0) {
            activeIntents.forEach((intent) => removeIntentSlot(intent.id, slotID));
            toast.info('Utterances containing this entity have been modified to remove the slot reference.');
          }

          deleteSlot(slotID);
        },
        canRename: () => true,
        canDelete: () => true,
        generateName: () => {
          const numberWord = Utils.number.convertToWord(slotsSize + 1);
          return `entity_${numberWord}`;
        },
        transformName: (name: string) => applySlotNameFormatting(platform)(name),
      },

      [InteractionModelTabType.VARIABLES]: {
        rename: null,
        delete: (id: string) => deleteVariable(id),
        canRename: () => false,
        canDelete: (id: string) => canDeleteVariable(id),
        // We shouldn't use this, because we can't change variable names, but it's here if needed
        generateName: () => Utils.id.cuid(),
        transformName: (name: string) => name,
      },
    }),
    [
      platform,
      slotsSize,
      deleteSlot,
      intentsSize,
      deleteIntent,
      onRenameSlot,
      deleteVariable,
      onRenameIntent,
      removeIntentSlot,
      canDeleteVariable,
      getIntentsUsingSlot,
    ]
  );

  const renameItem = React.useCallback(
    (name: string, id: string, type: InteractionModelTabType) => {
      const onRename = itemActions[type].rename;
      if (!onRename) return;
      onRename(name, id);
    },
    [itemActions]
  );

  const nameChangeTransform = React.useCallback(
    (name: string, tab: InteractionModelTabType) => itemActions[tab].transformName(name, platform),
    [itemActions]
  );

  const canRenameItem = React.useCallback((id: string, type: InteractionModelTabType) => itemActions[type].canRename(id), [itemActions]);

  const canDeleteItem = React.useCallback((id: string, type: InteractionModelTabType) => itemActions[type].canDelete(id), [itemActions]);

  const deleteItem = React.useCallback((itemID: string, type: InteractionModelTabType) => itemActions[type].delete(itemID), [itemActions]);

  const deleteItems = React.useCallback(
    async (itemIDs: string[], type: InteractionModelTabType) => {
      const itemsToDelete = itemIDs.filter((id) => canDeleteItem(id, type));

      if (!itemsToDelete.length) return itemsToDelete;

      if (type === InteractionModelTabType.INTENTS) {
        await deleteIntents(itemsToDelete);
      } else if (type === InteractionModelTabType.SLOTS) {
        await deleteSlots(itemsToDelete);
      } else if (type === InteractionModelTabType.VARIABLES) {
        const cleanedNames = itemsToDelete.map((name) => name.replace(`${VariableType.GLOBAL}:`, ''));

        await removeGlobalVariables(cleanedNames);
      }

      return itemsToDelete;
    },
    [canDeleteItem]
  );

  const generateItemName = React.useCallback((type: InteractionModelTabType) => itemActions[type].generateName(platform), [itemActions]);

  const api = useContextApi<NLUContextValue>({
    renameItem,
    deleteItem,
    deleteItems,
    canRenameItem,
    canDeleteItem,
    generateItemName,
    nameChangeTransform,
  });

  return <NLUContext.Provider value={api}>{children}</NLUContext.Provider>;
};
