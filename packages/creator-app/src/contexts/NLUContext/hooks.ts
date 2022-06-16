import { MenuOption, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails } from '@/config/planLimits/nluExport';
import { InteractionModelTabType, ModalType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import * as Export from '@/ducks/export';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { UpgradePrompt } from '@/ducks/tracking';
import { useDispatch, useFeature, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';

import { NLUContext } from './Context';

interface NLUItem extends MenuOption<undefined> {
  key: string;
  onClick?: VoidFunction;
}

interface useNLUItemMenuProps {
  itemID?: string | null;
  itemType: InteractionModelTabType;
  onRename?: () => void;
  isBuiltIn?: boolean;
}

export const useNLUItemMenu = ({ itemID, itemType, isBuiltIn, onRename: onRenameProp }: useNLUItemMenuProps) => {
  const nlu = React.useContext(NLUContext);
  const upgradeModal = useModals(ModalType.UPGRADE_MODAL);

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.projectByIDSelector, { id: projectID });

  const nluManager = useFeature(FeatureFlag.NLU_MANAGER);
  const revisedEntitlements = useFeature(FeatureFlag.REVISED_CREATOR_ENTITLEMENTS);

  const [permissionToExport] = usePermission(revisedEntitlements.isEnabled ? Permission.NLU_EXPORT_ALL : Permission.MODEL_EXPORT);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);

  const [trackingEvents] = useTrackingEvents();

  const [exporting, setIsExporting] = React.useState(false);

  const exportModel = useDispatch(Export.exportModel);

  const onRename = usePersistFunction(onRenameProp);

  const onExport = React.useCallback(
    async (exportType: NLPProvider) => {
      if (!itemID) return;

      if (
        (revisedEntitlements.isEnabled && ((exportType === NLPProvider.VF_CSV && permissionToExportCSV) || permissionToExport)) ||
        !revisedEntitlements.isEnabled
      ) {
        setIsExporting(true);

        toast.info('Exporting...');

        await exportModel(exportType, [itemID]);

        toast.success('Successfully Exported');

        setIsExporting(false);
      } else {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_NLU });

        const planLimits = getNLUExportLimitDetails(exportType);

        upgradeModal.open({ planLimitDetails: planLimits, promptOrigin: UpgradePrompt.EXPORT_NLU });
      }
    },
    [itemID, exportModel, upgradeModal.open]
  );

  const canDelete = !!itemID && nlu.canDeleteItem(itemID, itemType);
  const canRename = !!itemID && !!onRenameProp && nlu.canRenameItem(itemID, itemType);
  const canExport = !!itemID && nluManager.isEnabled && itemType === InteractionModelTabType.INTENTS;

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

      options.push({ key: 'delete', label: isBuiltIn ? 'Remove' : 'Delete', onClick: () => nlu.deleteItem(itemID, itemType) });
    }
    return options;
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, canExport, nlu.deleteItem, onExport]);

  return {
    options: memoizedOptions,
    exporting,
  };
};
