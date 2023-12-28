import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType, VariableType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDeleteVariable, useDispatch, useOrderedVariables, useSelector } from '@/hooks';

export interface NLUItemActions {
  rename: ((name: string, id: string) => void) | null;
  delete: (id: string) => void;
  canRename: (id: string) => boolean;
  canDelete: (id: string) => boolean;
  generateName: (() => string) | ((platform: Platform.Constants.PlatformType) => string);
  transformName: ((name: string) => string) | ((name: string, platform: Platform.Constants.PlatformType) => string);
}

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
  const deleteVariable = useDeleteVariable();
  const removeGlobalVariables = useDispatch(VersionV2.removeGlobalVariables);

  const platform = useSelector(ProjectV2.active.platformSelector);

  const [, variablesMap] = useOrderedVariables();

  const canDeleteVariable = React.useCallback((id: string) => variablesMap[id]?.type !== VariableType.BUILT_IN, [variablesMap]);

  const itemActions = React.useMemo<Record<InteractionModelTabType, NLUItemActions>>(
    () => ({
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
    [platform, deleteVariable, canDeleteVariable]
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

      if (type === InteractionModelTabType.VARIABLES) {
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
