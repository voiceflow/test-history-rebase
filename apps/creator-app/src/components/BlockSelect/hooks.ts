import { Flow, FolderScope, NodeType, Workflow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { useCallback } from 'react';

import { Designer, Diagram } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/store.hook';

import { BlockOption, GroupOption } from './types';
import { createGroupedSelectID } from './utils';

export const useOptionsTree = <Item extends Flow | Workflow>(
  items: Item[],
  { label, folderScope }: { label: string; folderScope: FolderScope }
) => {
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);
  const referenceSystem = useFeature(Realtime.FeatureFlag.REFERENCE_SYSTEM);
  const blockNodeResourceByNodeIDMapByDiagramIDMap = useSelector(
    Designer.Reference.selectors.blockNodeResourceByNodeIDMapByDiagramIDMap
  );

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
    buildFolderTree: useCallback(
      (folder, children): GroupOption => ({ id: folder.id, label: folder.name, options: children }),
      []
    ),
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
        let options: Array<BlockOption | GroupOption>;

        if (referenceSystem.isEnabled) {
          options = Object.values(blockNodeResourceByNodeIDMapByDiagramIDMap[workflow.diagramID] ?? {})?.reduce<
            Array<BlockOption | GroupOption>
          >((acc, resource) => {
            if (!resource) return acc;

            const isStart = resource.metadata.nodeType === NodeType.START;

            if (!isStart && !resource.metadata.name) return acc;

            return [
              ...acc,
              cacheOption({
                id: createGroupedSelectID(workflow.diagramID, resource.resourceID),
                label: isStart ? resource.metadata.name || 'Start' : resource.metadata.name,
                nodeID: resource.resourceID,
                diagramID: workflow.diagramID,
              }),
            ];
          }, []);
        } else {
          options = Object.values(sharedNodes?.[workflow.diagramID] ?? {}).reduce<Array<BlockOption | GroupOption>>(
            (acc, sharedNode) => {
              if (
                !sharedNode ||
                (sharedNode.type !== Realtime.BlockType.COMBINED && sharedNode.type !== Realtime.BlockType.START)
              )
                return acc;

              if (sharedNode.type !== Realtime.BlockType.START && !sharedNode.name) return acc;

              return [
                ...acc,
                cacheOption({
                  id: createGroupedSelectID(workflow.diagramID, sharedNode.nodeID),
                  label: sharedNode.type === Realtime.BlockType.START ? sharedNode.name || 'Start' : sharedNode.name,
                  nodeID: sharedNode.nodeID,
                  diagramID: workflow.diagramID,
                }),
              ];
            },
            []
          );
        }

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
      [sharedNodes, blockNodeResourceByNodeIDMapByDiagramIDMap, referenceSystem.isEnabled]
    ),
  });
};
