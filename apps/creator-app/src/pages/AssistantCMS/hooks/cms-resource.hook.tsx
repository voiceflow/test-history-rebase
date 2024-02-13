import { Utils } from '@voiceflow/common';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Divider, MenuItem, notify, Table, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import pluralize from 'pluralize';
import React from 'react';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFeature } from '@/hooks/feature';
import { useConfirmV2Modal } from '@/hooks/modal.hook';
import { useDispatch, useGetValueSelector, useStore } from '@/hooks/store.hook';
import { clipboardCopy } from '@/utils/clipboard.util';

import { CMS_TEST_ID } from '../AssistantCMS.constant';
import { useCMSManager } from '../contexts/CMSManager/CMSManager.hook';

export interface ICMSResourceGetMoreMenu {
  onShare?: (resourceID: string) => void;
  onExport?: (resourceID: string) => void;
  onRename?: (resourceID: string) => void;
  onDuplicate?: (resourceID: string) => void;
  canDelete?: (resourceID: string) => boolean;
  canRename?: (resourceID: string) => boolean;
}

export const useCMSResourceGetPath = () => {
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();

  return usePersistFunction((resourceID: string) => {
    const baseURL = getAtomValue(cmsManager.url);
    const isFolder = getAtomValue(cmsManager.folders).some((folder) => getAtomValue(folder).id === resourceID);

    return {
      path: `${baseURL}${isFolder ? `/folder/${resourceID}` : `/${resourceID}`}`,
      isFolder,
    };
  });
};

/**
 * returns a getter that returns all selected resources including nested resources
 */
export const useGetAllNestedResources = () => {
  const store = useStore();
  const cmsManager = useCMSManager();
  const getAtomValue = useGetAtomValue();

  return (ids: string[]) => {
    const folderScope = getAtomValue(cmsManager.folderScope);

    const allByIDsSelector = Designer.utils.getCMSResourceAllByIDsSelector(folderScope);
    const allByFolderIDsSelector = Designer.utils.getCMSResourceAllByFolderIDsSelector(folderScope);

    const cmsFolderIDs = new Set(getAtomValue(cmsManager.folders).map((folder) => getAtomValue(folder).id));

    const folderIDs = ids.filter((id) => cmsFolderIDs.has(id));
    const resourceIDs = ids.filter((id) => !cmsFolderIDs.has(id));

    const allFolderIDs = folderIDs.flatMap((id) => [
      id,
      ...Designer.Folder.selectors.allDeeplyNestedIDsByScopeAndParentID(store.getState(), { folderScope, parentID: id }),
    ]);

    return {
      folderIDs,
      folderScope,
      resourceIDs,
      allFolderIDs,
      allResources: [
        ...allByIDsSelector(store.getState(), { ids: resourceIDs }),
        ...allByFolderIDsSelector(store.getState(), { folderIDs: allFolderIDs }),
      ],
    };
  };
};

export const useCMSResourceOnDeleteMany = () => {
  const tableState = Table.useStateMolecule();
  const cmsManager = useCMSManager();
  const confirmModal = useConfirmV2Modal();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const effects = useAtomValue(cmsManager.effects);

  const folderDeleteMany = useDispatch(Designer.Folder.effect.deleteMany);
  const resourceDeleteMany = useDispatch(effects.deleteMany);
  const getAllNestedResources = useGetAllNestedResources();

  return (ids: string[]) => {
    const { folderIDs, folderScope, resourceIDs, allFolderIDs, allResources } = getAllNestedResources(ids);

    let allResourcesSize = allResources.length;

    // handle the case when there are no resources to delete
    if (!allResourcesSize && !folderIDs.length) {
      setSelectedIDs(new Set());

      notify.short.info(`No ${pluralize(folderScope, 0)} to delete`, { showIcon: false });

      return;
    }

    let label: string;

    if (!allResourcesSize && folderIDs.length) {
      allResourcesSize = allFolderIDs.length;
      label = pluralize('folder', allFolderIDs.length);
    } else {
      label = pluralize(folderScope, allResourcesSize);
    }

    confirmModal.openVoid({
      body: `Deleted ${label} won’t be recoverable unless you restore a previous agent backup. Please confirm that you want to continue.`,
      title: `Delete ${label} (${allResourcesSize})`,
      confirm: async () => {
        if (folderIDs.length) {
          await folderDeleteMany(folderIDs);
        }

        // no need to delete resources nested in folders, as they will be deleted with the folders
        if (resourceIDs.length) {
          await resourceDeleteMany(resourceIDs);
        }

        setSelectedIDs(new Set());

        notify.short.info(`${allResourcesSize} ${label} deleted`, { showIcon: false });
      },
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };
};

export const useCMSResourceGetMoreMenu = ({
  onShare,
  onExport,
  onRename,
  onDuplicate,
  canDelete = () => true,
  canRename = () => true,
}: ICMSResourceGetMoreMenu = {}) => {
  const TEST_ID = tid(CMS_TEST_ID, 'context-menu');

  const tableState = Table.useStateMolecule();
  const cmsFolders = useFeature(FeatureFlag.CMS_FOLDERS);
  const cmsManager = useCMSManager();
  const folderScope = useAtomValue(cmsManager.folderScope);
  const actionStates = useAtomValue(cmsManager.actionStates);
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);
  const setMoveToIsOpen = useSetAtom(actionStates.moveToIsOpen);
  const cmsResourceGetPath = useCMSResourceGetPath();

  const getHasByScope = useGetValueSelector(Designer.Folder.selectors.hasByScope, { folderScope });

  const onDeleteManyResources = useCMSResourceOnDeleteMany();

  return usePersistFunction(({ id, onClose }: { id: string; onClose: VoidFunction }) => {
    const hasByScope = getHasByScope();
    const { path, isFolder } = cmsResourceGetPath(id);

    const onDelete = () => onDeleteManyResources([id]);

    const onCopyLink = () => {
      clipboardCopy(`${window.location.origin}${path}`);

      notify.short.success(`Copied`);

      onClose();
    };

    const onMoveTo = () => {
      setSelectedIDs(new Set([id]));
      setMoveToIsOpen(true);
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

        {cmsFolders.isEnabled && hasByScope && (
          <MenuItem
            label="Move to..."
            onClick={Utils.functional.chainVoid(onClose, onMoveTo)}
            prefixIconName="MoveTo"
            testID={tid(TEST_ID, 'move-to')}
          />
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
