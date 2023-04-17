import * as Realtime from '@voiceflow/realtime-sdk';
import { downloadFromURL, MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as NLP from '@/config/nlp';
import * as NLU from '@/config/nlu';
import { InteractionModelTabType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Export from '@/ducks/export';
import * as Nlu from '@/ducks/nlu';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import { useFeature } from '@/hooks/feature';
import { usePermission, usePermissionAction } from '@/hooks/permission';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useUpgradeModal } from '@/ModalsV2/hooks';

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

  const project = useSelector(ProjectV2.active.projectSelector);

  const nluManager = useFeature(Realtime.FeatureFlag.NLU_MANAGER);

  const [exporting, setIsExporting] = React.useState(false);

  const exportModel = useDispatch(Export.exportModel);

  const onRename = usePersistFunction(onRenameProp);
  const onDelete = usePersistFunction(onDeleteProp);

  const onExportModel = usePersistFunction(async (nlpType: NLP.Constants.NLPType) => {
    if (!itemID) return;

    setIsExporting(true);

    toast.info('Exporting...');

    await exportModel({ origin: Tracking.ModelExportOriginType.NLU_MANAGER, nlpType, intents: [itemID] });

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
  const canRename = !!itemID && !!onRenameProp && nlu.canRenameItem(itemID, itemType);
  const canExport = !!itemID && nluManager.isEnabled && itemType === InteractionModelTabType.INTENTS;

  const memoizedOptions = React.useMemo<NLUItem[]>(() => {
    if (!itemID) return [];

    const options: NLUItem[] = [];
    const nluConfig = NLU.Config.get(project?.nlu);

    if (canExport) {
      options.push({ key: 'export-csv', label: 'Export CSV', onClick: () => onExportCSV() });

      if (nluConfig.nlps[0] !== NLP.Voiceflow.CONFIG) {
        options.push({ key: 'export-json', label: 'Export JSON', onClick: () => onExportAll(nluConfig.nlps[0].type) });
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
  }, [itemID, itemType, onRename, isBuiltIn, canDelete, canRename, canExport, nlu.deleteItem, onExportCSV, onExportAll]);

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
  const onDeleteUnclassified = useDispatch(Nlu.deleteUnclassified);

  const deleteUnclassified = usePermission(Permission.NLU_UNCLASSIFIED_DELETE);

  const [downloading, setIsDownloading] = React.useState(false);

  const onDelete = usePersistFunction(async (dataSourceID: string) => {
    await onDeleteUnclassified(dataSourceID);
    toast.success('Deleted');
  });

  const onDownload = usePersistFunction(async () => {
    if (!items) return;

    setIsDownloading(true);

    const data = items.join('\r\n');
    const blob = new Blob([data], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);

    downloadFromURL(`${NLP.Constants.NLPType.VOICEFLOW}-${dataSourceName}.csv`, url);
    URL.revokeObjectURL(data);
    toast.success('Downloaded');

    setIsDownloading(false);
  });

  const memoizedOptions = React.useMemo<NLUItem[]>(() => {
    if (!items) return [];

    const options: NLUItem[] = [
      {
        key: 'download',
        label: 'Download',
        onClick: onDownload,
      },
    ];

    if (deleteUnclassified.allowed) {
      if (options.length) {
        options.push({ key: 'divider-1', label: 'divider-1', divider: true });
      }

      options.push({
        key: 'delete',
        label: 'Delete',
        onClick: () => onDelete(dataSourceID),
      });
    }

    return options;
  }, [items, onDeleteUnclassified, deleteUnclassified.allowed]);

  return {
    options: memoizedOptions,
    downloading,
  };
};
