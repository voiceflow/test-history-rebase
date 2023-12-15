import { Utils } from '@voiceflow/common';
import { Divider, MenuItem, toast, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { clipboardCopy } from '@/utils/clipboard.util';

import { useCMSManager } from '../contexts/CMSManager/CMSManager.hook';
import { useCMSRouteFolders } from '../contexts/CMSRouteFolders';

export interface ICMSResourceGetMoreMenu {
  onShare?: (resourceID: string) => void;
  onExport?: (resourceID: string) => void;
  onRename?: (resourceID: string) => void;
  canDelete?: (resourceID: string) => boolean;
  canRename?: (resourceID: string) => boolean;
}

const defaultCanAction = () => true;

export const useCMSResourceGetMoreMenu = ({
  onShare,
  onExport,
  onRename,
  canDelete = defaultCanAction,
  canRename = defaultCanAction,
}: ICMSResourceGetMoreMenu = {}) => {
  const cmsManager = useCMSManager();
  const folderScope = useAtomValue(cmsManager.folderScope);
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const confirmModal = useConfirmV2Modal();
  const resourceEffects = useAtomValue(cmsManager.effects);

  const getIsFolderID = useGetValueSelector(Designer.Folder.selectors.isFolderID);
  const getHasScopeFolders = useGetValueSelector(Designer.Folder.selectors.hasScopeFolders, { folderScope });

  const deleteResource = useDispatch(resourceEffects.deleteOne);

  return usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const isFolder = getIsFolderID()(id);
    const hasScopeFolders = getHasScopeFolders();

    const getResourceUrl = (resourceID: string, isFolder: boolean) => {
      const cmsURL = getAtomValue(cmsManager.url);
      const activeFolderURL = getAtomValue(routeFolders.activeFolderURL);

      return `${window.location.origin}${activeFolderURL ?? cmsURL}${isFolder ? `/folder/${resourceID}` : `/${resourceID}`}`;
    };

    const onConfirmDelete = async () => {
      await deleteResource(id);

      toast.info(`${folderScope} deleted`, { showIcon: false, isClosable: false });
    };

    const onDelete = () => {
      confirmModal.openVoid({
        body: `Deleted ${folderScope} won’t be recoverable unless you restore a previous agent version. Please confirm that you want to continue.`,
        title: `Delete ${folderScope}`,
        confirm: onConfirmDelete,
        confirmButtonLabel: 'Delete forever',
        confirmButtonVariant: 'alert',
      });
    };

    const onCopyLink = () => {
      clipboardCopy(getResourceUrl(id, isFolder));

      toast.success(`Copied`, { isClosable: false });

      onClose();
    };

    return (
      <>
        {!!onRename && canRename(id) && (
          <MenuItem label="Rename" onClick={Utils.functional.chainVoid(onClose, () => onRename(id))} prefixIconName="Edit" />
        )}

        {!isFolder && onShare && (
          <MenuItem label="Share" onClick={Utils.functional.chainVoid(onClose, () => onShare(id))} prefixIconName="Community" />
        )}

        {onExport && <MenuItem label="Export" onClick={Utils.functional.chainVoid(onClose, () => onExport(id))} prefixIconName="Export" />}

        {hasScopeFolders && <MenuItem label="Move to..." onClick={Utils.functional.chainVoid(onClose)} prefixIconName="MoveTo" />}

        <MenuItem label="Copy link" onClick={onCopyLink} prefixIconName="Link" />

        {canDelete(id) && (
          <>
            <Divider />

            <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" />
          </>
        )}
      </>
    );
  });
};
