import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';
import { useHistory } from 'react-router';

import { useGetResolvedPath, useOnLinkClick } from '@/hooks/navigation.hook';

import { useCMSResourceGetMoreMenu, useGetCMSResourcePath } from './cms-resource.hook';
import { useCMSRenameColumn } from './cms-table.hook';

export const useCMSRowItemClick = (onClick?: (resourceID: string) => void) => {
  const onLinkClick = useOnLinkClick();
  const getCMSResourcePath = useGetCMSResourcePath();

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const { path, isFolder } = getCMSResourcePath(resourceID);

    if (isFolder) {
      onLinkClick(path)(event);
    } else if (onClick) {
      onClick(resourceID);
    } else {
      onLinkClick(path)(event);
    }
  });
};

export const useCMSRowItemNavigate = () => {
  const history = useHistory();
  const getResolvedPath = useGetResolvedPath();
  const getCMSResourcePath = useGetCMSResourcePath();

  return usePersistFunction((resourceID: string) => {
    const { path } = getCMSResourcePath(resourceID);

    history.push(getResolvedPath(path));
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
