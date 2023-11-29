import { Utils } from '@voiceflow/common';
import { Divider, MenuItem, toast, useCachedValue, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useCallback } from 'react';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { useCMSManager } from '../contexts/CMSManager/CMSManager.hook';
import { useCMSRouteFolders } from '../contexts/CMSRouteFolders';
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
  onCopyLink?: (link: string) => void;
  nameColumnType?: ColumnType;
}

export const useCMSRowItemContextMenu = <ColumnType extends string>({
  onShare,
  onExport,
  canDelete = () => true,
  canRename = () => true,
  onCopyLink,
  nameColumnType,
}: CMSRowItemContextMenuProps<ColumnType> = {}) => {
  const onRename = useCMSRenameColumn(nameColumnType);
  const cmsManager = useCMSManager();
  const folderScope = useAtomValue(cmsManager.folderScope);
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const confirmModal = useConfirmV2Modal();
  const resourceEffects = useAtomValue(cmsManager.effects);

  const isFolderID = useSelector(Designer.Folder.selectors.isFolderID);
  const hasScopeFolders = useSelector(Designer.Folder.selectors.hasScopeFolders, { folderScope });

  const deleteResource = useDispatch(resourceEffects.deleteOne);

  const cache = useCachedValue({ onShare, onExport, onCopyLink });

  return useCallback(
    ({ id, onClose }: { id: string; onClose: VoidFunction }) => {
      const isFolder = isFolderID(id);
      const { onShare, onExport, onCopyLink } = cache.current;

      const getResourceUrl = (resourceID: string, isFolder: boolean) => {
        const cmsURL = getAtomValue(cmsManager.url);
        const activeFolderURL = getAtomValue(routeFolders.activeFolderURL);

        return `${window.location.origin}${activeFolderURL ?? cmsURL}${isFolder ? `/folder/${resourceID}` : `/${resourceID}`}`;
      };

      const onConfirmDelete = async () => {
        await deleteResource(id);

        toast.info(`${folderScope} deleted`);
      };

      const onDelete = () => {
        confirmModal.openVoid({
          body: `Deleted ${folderScope} won’t be recoverable unless you restore a previous agent version. Please confirm that you want to continue.`,
          title: `Delete ${folderScope}`,
          confirm: onConfirmDelete,
          confirmButtonLabel: 'Delete forever',
          confirmButtonVariant: 'themedAlert',
        });
      };

      const canRenameResource = !!nameColumnType && canRename(id);

      return (
        <>
          {canRenameResource && <MenuItem label="Rename" onClick={Utils.functional.chainVoid(onClose, () => onRename(id))} prefixIconName="Edit" />}

          {!isFolder && onShare && (
            <MenuItem label="Share" onClick={Utils.functional.chainVoid(onClose, () => onShare(id))} prefixIconName="Community" />
          )}

          {onExport && <MenuItem label="Export" onClick={Utils.functional.chainVoid(onClose, () => onExport(id))} prefixIconName="Export" />}

          {hasScopeFolders && <MenuItem label="Move to..." onClick={Utils.functional.chainVoid(onClose)} prefixIconName="MoveTo" />}

          {onCopyLink && (
            <MenuItem
              label="Copy link"
              onClick={Utils.functional.chainVoid(onClose, () => onCopyLink(getResourceUrl(id, isFolder)))}
              prefixIconName="Link"
            />
          )}

          {canDelete(id) && (
            <>
              {((!isFolder && onShare) || onExport || onCopyLink || hasScopeFolders || canRenameResource) && <Divider />}

              <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" />
            </>
          )}
        </>
      );
    },
    [canRename, canDelete, isFolderID, hasScopeFolders, routeFolders.activeFolderURL]
  );
};
