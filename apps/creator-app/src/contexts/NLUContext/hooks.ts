import { MenuTypes, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';

import { NLUContext } from './Context';

interface NLUItem extends MenuTypes.OptionWithoutValue {
  key: string;
  onClick?: VoidFunction;
}

interface useNLUItemMenuProps {
  itemID?: string | null;
  itemType: InteractionModelTabType;
  onRename?: () => void;
  onDelete?: () => void;
  isBuiltIn?: boolean;
}

export const useNLUItemMenu = ({ itemID, itemType, isBuiltIn, onRename: onRenameProp, onDelete: onDeleteProp }: useNLUItemMenuProps) => {
  const nlu = React.useContext(NLUContext);
  const [exporting] = React.useState(false);

  const onRename = usePersistFunction(onRenameProp);
  const onDelete = usePersistFunction(onDeleteProp);

  const canDelete = !!itemID && nlu.canDeleteItem(itemID, itemType);
  const canRename = !!itemID && !!onRenameProp && nlu.canRenameItem(itemID, itemType) && itemType !== InteractionModelTabType.VARIABLES;

  const memoizedOptions = React.useMemo<NLUItem[]>(() => {
    if (!itemID) return [];

    const options: NLUItem[] = [];

    if (canRename) {
      if (options.length) {
        options.push({ key: 'divider-1', label: 'divider-1', divider: true });
      }

      options.push({ key: 'rename', label: 'Rename', onClick: onRename });
    }

    if (canDelete) {
      if (options.length) {
        options.push({ key: 'divider-2', label: 'divider-2', divider: true });
      }

      options.push({
        key: 'delete',
        label: isBuiltIn ? 'Remove' : 'Delete',
        onClick: () => {
          nlu.deleteItem(itemID, itemType);
          onDelete();
        },
      });
    }
    return options;
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, nlu.deleteItem]);

  return {
    options: memoizedOptions,
    exporting,
  };
};
