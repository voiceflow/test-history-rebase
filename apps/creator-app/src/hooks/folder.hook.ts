import { Folder, FolderScope } from '@voiceflow/dtos';
import { useMemo } from 'react';
import { generatePath } from 'react-router';

import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import { Designer, Session } from '@/ducks';
import { useGetValueSelector, useSelector } from '@/hooks/store.hook';

export const useFolderTree = <T extends { id: string; folderID: string | null }, FR, DR = FR>({
  data,
  folderScope,
  buildDataTree,
  buildFolderTree,
}: {
  data: T[];
  folderScope: FolderScope;
  /**
   * should be memoized function (useCallback)
   */
  buildDataTree: (data: T, parentID: string | null) => DR;
  /**
   * should be memoized function (useCallback)
   */
  buildFolderTree: (folder: Folder, children: Array<FR | DR>, parentID: string | null) => FR;
}): Array<FR | DR> => {
  const folders = useSelector(Designer.Folder.selectors.allByScope, { folderScope });

  const foldersParentIDMap = useMemo(() => {
    const map = new Map<string | null, Folder[]>();

    folders.forEach((folder) => {
      if (!map.has(folder.parentID)) {
        map.set(folder.parentID, []);
      }

      map.get(folder.parentID)?.push(folder);
    });

    return map;
  }, [folders]);

  const dataFolderIDMap = useMemo(() => {
    const map = new Map<string | null, T[]>();

    data.forEach((item) => {
      if (!map.has(item.folderID)) {
        map.set(item.folderID, []);
      }

      map.get(item.folderID)?.push(item);
    });

    return map;
  }, [data]);

  return useMemo(() => {
    const buildData = (data: T[], parentID: string | null) => data.map((item) => buildDataTree(item, parentID));

    const buildFolders = (folders: Folder[], parentID: string | null) =>
      folders.reduce<FR[]>((acc, folder) => {
        const children = [
          ...buildFolders(foldersParentIDMap.get(folder.id) ?? [], folder.id),
          ...buildData(dataFolderIDMap.get(folder.id) ?? [], folder.id),
        ];

        if (children.length) {
          const tree = buildFolderTree(folder, children, parentID);
          acc.push(tree);
        }

        return acc;
      }, []);

    return [...buildFolders(foldersParentIDMap.get(null) ?? [], null), ...buildData(dataFolderIDMap.get(null) ?? [], null)];
  }, [dataFolderIDMap, foldersParentIDMap, buildDataTree, buildFolderTree]);
};

export const useGetFolderPath = (folderScope: FolderScope) => {
  const getVersionID = useGetValueSelector(Session.activeVersionIDSelector);
  const getIDsChainByLeafFolderID = useGetValueSelector(Designer.Folder.selectors.idsChainByLeafFolderID);

  return (folderID: string) => {
    const versionID = getVersionID();

    Errors.assertVersionID(versionID);

    const folderIDs = getIDsChainByLeafFolderID({ folderID });

    const folderPaths = folderIDs.map((id) => `folder/${id}`).join('/');

    return generatePath(`${Path.CMS_RESOURCE}/${folderPaths}`, { versionID, resourceType: folderScope });
  };
};
