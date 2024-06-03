import { Flow, FolderScope, Workflow } from '@voiceflow/dtos';
import { BlockType } from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { useCallback } from 'react';

import { Diagram } from '@/ducks';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID } from '@/hooks/select';

import { BlockOption, GroupOption } from './types';

export const useOptionsTree = <Item extends Flow | Workflow>(
  items: Item[],
  { label, folderScope }: { label: string; folderScope: FolderScope }
) => {
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);

  return useFolderTree<
    Flow,
    GroupOption | UIOnlyMenuItemOption,
    GroupOption | BlockOption | UIOnlyMenuItemOption,
    UIOnlyMenuItemOption
  >({
    data: items,
    dataSorter: (a, b) => a.label.localeCompare(b.label),
    folderScope,
    folderSorter: (a, b) => a.label.localeCompare(b.label),
    buildFolderTree: useCallback((folder, children): GroupOption => ({ id: folder.id, label: folder.name, options: children }), []),
    buildFolderSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption =>
        createUIOnlyMenuItemOption(`${id}-header`, { label: 'Folders', groupHeader: true }),
      []
    ),
    buildDataSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption =>
        createUIOnlyMenuItemOption(`${id}-header`, { label, groupHeader: true }),
      []
    ),
    buildDataTree: useCallback(
      (workflow, _, cacheOption): GroupOption => {
        const options = Object.values(sharedNodes?.[workflow.diagramID] ?? {}).reduce<Array<BlockOption | GroupOption>>(
          (acc, sharedNode) => {
            if (!sharedNode || (sharedNode.type !== BlockType.COMBINED && sharedNode.type !== BlockType.START))
              return acc;
            if (sharedNode.type !== BlockType.START && !sharedNode.name) return acc;

            return [
              ...acc,
              cacheOption({
                id: createGroupedSelectID(workflow.diagramID, sharedNode.nodeID),
                label: sharedNode.type === BlockType.START ? sharedNode.name || 'Start' : sharedNode.name,
                nodeID: sharedNode.nodeID,
                diagramID: workflow.diagramID,
              }),
            ];
          },
          []
        );

        return {
          id: workflow.id,
          label: workflow.name,
          options: [
            cacheOption(
              createUIOnlyMenuItemOption(`${workflow.id}-blocks-header`, { label: 'Blocks', groupHeader: true })
            ),
            ...(!options.length
              ? [
                  cacheOption(
                    createUIOnlyMenuItemOption(`${workflow.id}-no-blocks`, {
                      label: 'No blocks',
                      isEmpty: true,
                      disabled: true,
                    })
                  ),
                ]
              : options),
          ],
        };
      },
      [sharedNodes]
    ),
  });
};
