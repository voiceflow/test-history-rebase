import { Folder, FolderScope } from '@voiceflow/dtos';
import { useMemo } from 'react';
import { generatePath } from 'react-router';

import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import { Designer, Session } from '@/ducks';
import { useGetValueSelector, useSelector } from '@/hooks/store.hook';

export const useFolderTree = <
  T extends { id: string; folderID: string | null },
  FR extends { id: string },
  DR extends { id: string } = FR,
  SR extends { id: string } = FR
>({
  data,
  folderScope,
  buildDataTree,
  buildFolderTree,
  buildDataSeparator,
  buildFolderSeparator,
}: {
  data: T[];
  folderScope: FolderScope;
  /**
   * should be memoized function (useCallback)
   */
  buildDataTree: (data: T, parentID: string | null, cacheOption: (option: DR) => DR) => DR;
  /**
   * should be memoized function (useCallback)
   */
  buildFolderTree: (folder: Folder, children: Array<FR | DR | SR>, parentID: string | null) => FR;

  /**
   * should be memoized function (useCallback)
   */
  buildDataSeparator?: (dataTree: DR[]) => SR;

  /**
   * should be memoized function (useCallback)
   */
  buildFolderSeparator?: (folderTree: FR[]) => SR;
}): [options: Array<FR | DR | SR>, optionMap: Record<string, FR | DR | SR>] => {
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
    const optionMap: Record<string, FR | DR | SR> = {};

    const cacheOption = (option: DR) => {
      optionMap[option.id] = option;

      return option;
    };
    const buildData = (data: T[], parentID: string | null) =>
      data.map((item) => {
        const tree = buildDataTree(item, parentID, cacheOption);

        optionMap[tree.id] = tree;

        return tree;
      });

    const buildChildrenWithSeparators = (folderTrees: FR[], dataTrees: DR[]) => {
      if (!buildDataSeparator && !buildFolderSeparator) return [...folderTrees, ...dataTrees];

      const children: Array<FR | DR | SR> = [];

      if (buildFolderSeparator && folderTrees.length) {
        const separator = buildFolderSeparator(folderTrees);

        children.push(separator);
        optionMap[separator.id] = separator;
      }

      children.push(...folderTrees);

      if (buildDataSeparator && dataTrees.length) {
        const separator = buildDataSeparator(dataTrees);

        children.push(separator);
        optionMap[separator.id] = separator;
      }

      children.push(...dataTrees);

      return children;
    };

    const buildFolders = (folders: Folder[], parentID: string | null) =>
      folders.reduce<FR[]>((acc, folder) => {
        const children = buildChildrenWithSeparators(
          buildFolders(foldersParentIDMap.get(folder.id) ?? [], folder.id),
          buildData(dataFolderIDMap.get(folder.id) ?? [], folder.id)
        );

        if (children.length) {
          const tree = buildFolderTree(folder, children, parentID);

          acc.push(tree);
          optionMap[tree.id] = tree;
        }

        return acc;
      }, []);

    const children = buildChildrenWithSeparators(
      buildFolders(foldersParentIDMap.get(null) ?? [], null),
      buildData(dataFolderIDMap.get(null) ?? [], null)
    );

    return [children, optionMap];
  }, [dataFolderIDMap, foldersParentIDMap, buildDataTree, buildFolderTree, buildFolderSeparator, buildDataSeparator]);
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
