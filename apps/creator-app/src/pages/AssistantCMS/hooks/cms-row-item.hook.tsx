import { usePersistFunction } from '@voiceflow/ui-next';
import type React from 'react';
import { useContext } from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';
import { useHistory } from 'react-router';

import { useGetResolvedPath, useOnLinkClick } from '@/hooks/navigation.hook';

import type { ICMSResourceGetMoreMenu } from './cms-resource.hook';
import { useCMSResourceGetMoreMenu, useCMSResourceGetPath } from './cms-resource.hook';
import { useCMSRenameColumn } from './cms-table.hook';

export const useCMSRowItemClick = (onClick?: (resourceID: string) => void) => {
  const onLinkClick = useOnLinkClick();
  const dismissableLayer = useContext(DismissableLayerContext);
  const cmsResourceGetPath = useCMSResourceGetPath();

  return usePersistFunction((resourceID: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dismissableLayer.dismissAllGlobally();

    const { path, isFolder } = cmsResourceGetPath(resourceID);

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
  const dismissableLayer = useContext(DismissableLayerContext);

  const cmsResourceGetPath = useCMSResourceGetPath();

  return usePersistFunction((resourceID: string) => {
    const { path } = cmsResourceGetPath(resourceID);

    history.push(getResolvedPath(path));
    dismissableLayer.dismissAllGlobally();
  });
};

export interface CMSRowItemContextMenuProps<ColumnType extends string>
  extends Omit<ICMSResourceGetMoreMenu, 'onRename'> {
  nameColumnType?: ColumnType;
}

export const useCMSRowItemContextMenu = <ColumnType extends string>({
  nameColumnType,
  ...props
}: CMSRowItemContextMenuProps<ColumnType> = {}) => {
  const onRename = useCMSRenameColumn(nameColumnType);

  return useCMSResourceGetMoreMenu({
    ...props,
    onRename: nameColumnType ? onRename : undefined,
  });
};
