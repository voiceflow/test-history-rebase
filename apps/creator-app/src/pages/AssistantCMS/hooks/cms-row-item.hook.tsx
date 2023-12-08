import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useOnLinkClick } from '@/hooks/navigation.hook';

import { useCMSManager } from '../contexts/CMSManager/CMSManager.hook';
import { useCMSRouteFolders } from '../contexts/CMSRouteFolders';
import { useCMSResourceGetMoreMenu } from './cms-resource.hook';
import { useCMSRenameColumn } from './cms-table.hook';

export const useCMSRowItemClick = (onClick?: (resourceID: string) => void) => {
  const cmsManager = useCMSManager();
  const onLinkClick = useOnLinkClick();
  const getAtomValue = useGetAtomValue();
  const cmsRouteFolders = useCMSRouteFolders();

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const basePath = getAtomValue(cmsRouteFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

    if (getAtomValue(cmsManager.folders).some((folder) => getAtomValue(folder).id === resourceID)) {
      onLinkClick(`${basePath}/folder/${resourceID}`)(event);
    } else if (onClick) {
      onClick(resourceID);
    } else {
      onLinkClick(`${basePath}/${resourceID}`)(event);
    }
  });
};

export interface CMSRowItemContextMenuProps<ColumnType extends string> {
  onShare?: (resourceID: string) => void;
  onExport?: (resourceID: string) => void;
  canRename?: (resourceID: string) => boolean;
  canDelete?: (resourceID: string) => boolean;
  nameColumnType?: ColumnType;
}

export const useCMSRowItemContextMenu = <ColumnType extends string>({
  onShare,
  onExport,
  canDelete = () => true,
  canRename = () => true,
  nameColumnType,
}: CMSRowItemContextMenuProps<ColumnType> = {}) => {
  const onRename = useCMSRenameColumn(nameColumnType);

  return useCMSResourceGetMoreMenu({
    onShare,
    onRename,
    onExport,
    canDelete,
    canRename: (id) => !!nameColumnType && canRename(id),
  });
};
