import * as Realtime from '@voiceflow/realtime-sdk';
import { downloadFromURL, MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as NLP from '@/config/nlp';
import * as NLU from '@/config/nlu';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails } from '@/config/planLimits/nluExport';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Export from '@/ducks/export';
import * as Nlu from '@/ducks/nlu';
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
    async (nlpType: NLP.Constants.NLPType) => {
      if (!itemID) return;

      if ((nlpType === NLP.Constants.NLPType.VOICEFLOW && permissionToExportCSV) || permissionToExport) {
        setIsExporting(true);

        toast.info('Exporting...');

        await exportModel({
          origin: Tracking.ModelExportOriginType.NLU_MANAGER,
          nlpType,
          intents: [itemID],
        });

        toast.success('Successfully Exported');

        setIsExporting(false);
      } else {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_NLU });

        const planLimits = getNLUExportLimitDetails(nlpType);

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
    const nluConfig = NLU.Config.get(project?.nlu);

    if (canExport) {
      options.push({ key: 'export-csv', label: 'Export CSV', onClick: () => onExport(NLP.Constants.NLPType.VOICEFLOW) });

      if (nluConfig.nlps[0] !== NLP.Voiceflow.CONFIG) {
        options.push({ key: 'export-json', label: 'Export JSON', onClick: () => onExport(nluConfig.nlps[0].type) });
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

interface useDataSourceMenuProps {
  items?: string[] | null;
  dataSourceID: string;
  dataSourceName: string;
}

export const useDataSourceMenu = ({ items, dataSourceName, dataSourceID }: useDataSourceMenuProps) => {
  const [permissionToDownloadUnclassified] = usePermission(Permission.NLU_UNCLASSIFIED_DOWNLOAD);
  const canDelete = usePermission(Permission.NLU_UNCLASSIFIED_DELETE);
  const [downloading, setIsDownloading] = React.useState(false);
  const onDeleteUnclassified = useDispatch(Nlu.deleteUnclassified);
  const [trackingEvents] = useTrackingEvents();
  const upgradeModal = useModals(ModalType.UPGRADE_MODAL);

  const handleDownload = React.useCallback(async () => {
    if (!items?.length) return;

    if (permissionToDownloadUnclassified) {
      setIsDownloading(true);

      toast.info('Downloading...');

      const data = items.join('\r\n');
      const blob = new Blob([data], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);

      downloadFromURL(`${NLP.Constants.NLPType.VOICEFLOW}-${dataSourceName}.csv`, url);
      URL.revokeObjectURL(data);
      toast.success('Successfully Exported');

      setIsDownloading(false);
    } else {
      trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_NLU });

      const planLimits = getNLUExportLimitDetails(NLP.Constants.NLPType.VOICEFLOW);

      upgradeModal.open({ planLimitDetails: planLimits, promptOrigin: UpgradePrompt.EXPORT_NLU });
    }
  }, [items]);

  const memoizedOptions = React.useMemo<NLUItem[]>(() => {
    if (!items) return [];

    const options: NLUItem[] = [];

    if (permissionToDownloadUnclassified) {
      options.push({
        key: 'download',
        label: 'Download',
        onClick: handleDownload,
      });
    }

    if (canDelete) {
      if (options.length) {
        options.push({ key: 'divider-1', label: 'divider-1', divider: true });
      }

      options.push({
        key: 'delete',
        label: 'Delete',
        onClick: () => onDeleteUnclassified(dataSourceID),
      });
    }
    return options;
  }, [items, onDeleteUnclassified, canDelete]);

  return {
    options: memoizedOptions,
    downloading,
  };
};
