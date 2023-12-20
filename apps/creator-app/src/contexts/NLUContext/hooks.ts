import { MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as NLP from '@/config/nlp';
import { InteractionModelTabType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Export from '@/ducks/export';
import * as Tracking from '@/ducks/tracking';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermissionAction } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';

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
  const upgradeModal = useUpgradeModal();

  const [exporting, setIsExporting] = React.useState(false);

  const exportModel = useDispatch(Export.exportModel);

  const onRename = usePersistFunction(onRenameProp);
  const onDelete = usePersistFunction(onDeleteProp);

  const onExportModel = usePersistFunction(async (nlpType: NLP.Constants.NLPType) => {
    if (!itemID) return;

    setIsExporting(true);

    toast.info('Exporting...');

    await exportModel({ origin: Tracking.ModelExportOriginType.SHARE_MENU, nlpType, intents: [itemID] });

    toast.success('Successfully Exported');

    setIsExporting(false);
  });

  const onExportAll = usePersistFunction(
    usePermissionAction(Permission.NLU_EXPORT_ALL, {
      onAction: onExportModel,

      onPlanForbid: ({ args: [nlpType], planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal({ nlpType })),
    })
  );

  const onExportCSV = usePersistFunction(
    usePermissionAction(Permission.NLU_EXPORT_CSV, {
      onAction: () => onExportModel(NLP.Constants.NLPType.VOICEFLOW),

      onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
    })
  );

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
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, nlu.deleteItem, onExportCSV, onExportAll]);

  return {
    options: memoizedOptions,
    exporting,
  };
};
