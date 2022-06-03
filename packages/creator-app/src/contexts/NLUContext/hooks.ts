import { MenuOption, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { InteractionModelTabType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import { NLUContext } from '@/contexts';
import * as Export from '@/ducks/export';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useDispatch, useFeature, useSelector } from '@/hooks';

type NLUItem = MenuOption<undefined>;

interface useNLUItemMenuProps {
  itemID: string;
  itemType: InteractionModelTabType;
  onRename?: () => void;
  isBuiltIn?: boolean;
}

export const useNLUItemMenu = ({ itemID, itemType, isBuiltIn, onRename: onRenameProp }: useNLUItemMenuProps) => {
  const { deleteItem, canDeleteItem, canRenameItem } = React.useContext(NLUContext);
  const [exporting, setIsExporting] = React.useState(false);
  const nluManager = useFeature(FeatureFlag.NLU_MANAGER);

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });

  const exportModel = useDispatch(Export.exportModel);

  const onRename = usePersistFunction(onRenameProp);

  const onExport = React.useCallback(
    async (exportType: NLPProvider) => {
      setIsExporting(true);

      toast.warn('Exporting...');
      await exportModel(exportType, [itemID]);
      toast.success('Successfully Exported');

      setIsExporting(false);
    },
    [itemID, exportModel]
  );

  const canDelete = canDeleteItem(itemID, itemType);
  const canRename = !!onRenameProp && canRenameItem(itemID, itemType);
  const canExport = nluManager.isEnabled && itemType === InteractionModelTabType.INTENTS;

  const memoizedOptions = React.useMemo<NLUItem[]>(() => {
    if (!itemID) return [];

    const options: NLUItem[] = [];
    const nlpProvider: null | Exclude<NLPProvider, NLPProvider.VF_CSV> = (project?.platform && PlatformToNLPProvider[project.platform]) || null;

    if (canExport) {
      options.push({ key: 'export-csv', label: 'Export CSV', onClick: () => onExport(NLPProvider.VF_CSV) });

      if (nlpProvider) {
        options.push({ key: 'export-json', label: 'Export JSON', onClick: () => onExport(nlpProvider) });
      }
    }

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

      options.push({ key: 'delete', label: isBuiltIn ? 'Remove' : 'Delete', onClick: () => deleteItem(itemID, itemType) });
    }
    return options;
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, canExport, deleteItem]);

  return {
    options: memoizedOptions,
    exporting,
  };
};
