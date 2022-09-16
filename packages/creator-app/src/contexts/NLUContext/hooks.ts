import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails } from '@/config/planLimits/nluExport';
import { InteractionModelTabType, ModalType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import * as Export from '@/ducks/export';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { UpgradePrompt } from '@/ducks/tracking';
import { useDispatch, useFeature, useModals, usePermission, useSelector, useTrackingEvents } from '@/hooks';

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
  const upgradeModal = useModals(ModalType.UPGRADE_MODAL);

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.projectByIDSelector, { id: projectID });

  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const [permissionToExport] = usePermission(Permission.NLU_EXPORT_ALL);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);

  const [trackingEvents] = useTrackingEvents();

  const [exporting, setIsExporting] = React.useState(false);

  const exportModel = useDispatch(Export.exportModel);

  const onRename = usePersistFunction(onRenameProp);
  const onDelete = usePersistFunction(onDeleteProp);

  const onExport = React.useCallback(
    async (exportType: NLPProvider) => {
      if (!itemID) return;

      if ((exportType === NLPProvider.VF_CSV && permissionToExportCSV) || permissionToExport) {
        setIsExporting(true);

        toast.info('Exporting...');

        await exportModel(exportType, Tracking.ModelExportOriginType.NLU_MANAGER, [itemID]);

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
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, canExport, nlu.deleteItem, onExport]);

  return {
    options: memoizedOptions,
    exporting,
  };
};
