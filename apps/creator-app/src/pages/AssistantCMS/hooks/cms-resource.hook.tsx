import { Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Divider, MenuItem, notify, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useGetValueSelector } from '@/hooks/store.hook';
import { clipboardCopy } from '@/utils/clipboard.util';

import { CMS_TEST_ID } from '../AssistantCMS.constant';
import { useCMSManager } from '../contexts/CMSManager/CMSManager.hook';
import { useCMSRouteFolders } from '../contexts/CMSRouteFolders';

const TEST_ID = tid(CMS_TEST_ID, 'context-menu');

export interface ICMSResourceGetMoreMenu {
  onShare?: (resourceID: string) => void;
  onExport?: (resourceID: string) => void;
  onRename?: (resourceID: string) => void;
  onDuplicate?: (resourceID: string) => void;
  canDelete?: (resourceID: string) => boolean;
  canRename?: (resourceID: string) => boolean;
}

export const useGetCMSResourcePath = () => {
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();
  const cmsRouteFolders = useCMSRouteFolders();

  return usePersistFunction((resourceID: string) => {
    const basePath = getAtomValue(cmsRouteFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);
    const isFolder = getAtomValue(cmsManager.folders).some((folder) => getAtomValue(folder).id === resourceID);

    return {
      path: `${basePath}${isFolder ? `/folder/${resourceID}` : `/${resourceID}`}`,
      isFolder,
    };
  });
};

export const useCMSResourceGetMoreMenu = ({
  onShare,
  onExport,
  onRename,
  onDuplicate,
  canDelete = () => true,
  canRename = () => true,
}: ICMSResourceGetMoreMenu = {}) => {
  const cmsManager = useCMSManager();
  const folderScope = useAtomValue(cmsManager.folderScope);
  const confirmModal = useConfirmV2Modal();
  const resourceEffects = useAtomValue(cmsManager.effects);
  const getCMSResourcePath = useGetCMSResourcePath();

  const getHasScopeFolders = useGetValueSelector(Designer.Folder.selectors.hasScopeFolders, { folderScope });

  const deleteResource = useDispatch(resourceEffects.deleteOne);

  return usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const hasScopeFolders = getHasScopeFolders();
    const { path, isFolder } = getCMSResourcePath(id);

    const onConfirmDelete = async () => {
      await deleteResource(id);

      notify.short.info(`1 ${folderScope} deleted`, { showIcon: false });
    };

    const onDelete = () => {
      confirmModal.openVoid({
        body: `Deleted ${folderScope} won’t be recoverable unless you restore a previous agent backup. Please confirm that you want to continue.`,
        title: `Delete ${folderScope}`,
        confirm: onConfirmDelete,
        confirmButtonLabel: 'Delete forever',
        confirmButtonVariant: 'alert',
      });
    };

    const onCopyLink = () => {
      clipboardCopy(`${window.location.origin}${path}`);

      notify.short.success(`Copied`);

      onClose();
    };

    return (
      <>
        {!!onRename && canRename(id) && (
          <MenuItem
            label="Rename"
            onClick={Utils.functional.chainVoid(onClose, () => onRename(id))}
            prefixIconName="Edit"
            testID={tid(TEST_ID, 'rename')}
          />
        )}

        {!!onDuplicate && (
          <MenuItem
            label="Duplicate"
            onClick={Utils.functional.chainVoid(onClose, () => onDuplicate(id))}
            prefixIconName="Duplicate"
            testID={tid(TEST_ID, 'duplicate')}
          />
        )}

        {!isFolder && onShare && (
          <MenuItem
            label="Share"
            onClick={Utils.functional.chainVoid(onClose, () => onShare(id))}
            prefixIconName="Community"
            testID={tid(TEST_ID, 'share')}
          />
        )}

        {onExport && (
          <MenuItem
            label="Export"
            onClick={Utils.functional.chainVoid(onClose, () => onExport(id))}
            prefixIconName="Export"
            testID={tid(TEST_ID, 'export')}
          />
        )}

        {hasScopeFolders && (
          <MenuItem label="Move to..." onClick={Utils.functional.chainVoid(onClose)} prefixIconName="MoveTo" testID={tid(TEST_ID, 'move-to')} />
        )}

        <MenuItem label="Copy link" onClick={onCopyLink} prefixIconName="Link" testID={tid(TEST_ID, 'copy-link')} />

        {canDelete(id) && (
          <>
            <Divider />

            <MenuItem label="Delete" onClick={Utils.functional.chainVoid(onClose, onDelete)} prefixIconName="Trash" testID={tid(TEST_ID, 'delete')} />
          </>
        )}
      </>
    );
  });
};
