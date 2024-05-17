/* eslint-disable no-param-reassign */

import { Flow, FolderScope, Workflow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BlockType } from '@voiceflow/realtime-sdk';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React, { useCallback } from 'react';

import { Designer, Diagram } from '@/ducks';
import { useFolderTree } from '@/hooks/folder.hook';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID } from '@/hooks/select';
import { getDiagramName, isComponentDiagram } from '@/utils/diagram.utils';

import { BlockOption, Group, GroupOption, Multilevel, Option } from './types';

const createDiagramOptions = <OptionsMap extends Record<string, Option | Group> | Record<string, Option | Multilevel>>(
  diagramID: string,
  optionsMap: OptionsMap,
  diagramSharedNodes: Realtime.diagram.sharedNodes.SharedNodeMap
) =>
  Object.values(diagramSharedNodes).reduce<Option[]>((acc, sharedNode) => {
    if (sharedNode?.type !== Realtime.BlockType.COMBINED && sharedNode?.type !== Realtime.BlockType.START) return acc;
    if (sharedNode.type !== Realtime.BlockType.START && !sharedNode.name) return acc;

    const option = {
      id: createGroupedSelectID(diagramID, sharedNode.nodeID),
      label: sharedNode.type === Realtime.BlockType.START ? sharedNode.name || 'Start' : sharedNode.name,
      nodeID: sharedNode.nodeID,
      diagramID,
    };

    acc.push(option);
    optionsMap[option.id] = option;

    return acc;
  }, []);

export const useDiagramsBlocksOptionsMap = () => {
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);
  const getDiagramByID = useSelector(Diagram.getDiagramByIDSelector);
  const flowMapByDiagramID = useSelector(Designer.Flow.selectors.mapByDiagramID);

  return React.useMemo(() => {
    return Object.entries(sharedNodes).reduce<Record<string, Option | Group>>((optionsMap, [diagramID, diagramSharedNodes]) => {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram) return optionsMap;
      const flow = isComponentDiagram(diagram.type) ? flowMapByDiagramID[diagram.id] : null;

      const diagramOptions = createDiagramOptions(diagramID, optionsMap, diagramSharedNodes);
      const diagramName = flow ? flow.name : getDiagramName(diagram.name);

      optionsMap[diagramID] = { id: diagramID, label: diagramName, options: diagramOptions };

      return optionsMap;
    }, {});
  }, [sharedNodes, getDiagramByID]);
};

export const useOptionsTree = <Item extends Flow | Workflow>(items: Item[], { label, folderScope }: { label: string; folderScope: FolderScope }) => {
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);

  return useFolderTree<Flow, GroupOption | UIOnlyMenuItemOption, GroupOption | BlockOption | UIOnlyMenuItemOption, UIOnlyMenuItemOption>({
    data: items,
    dataSorter: (a, b) => a.label.localeCompare(b.label),
    folderScope,
    folderSorter: (a, b) => a.label.localeCompare(b.label),
    buildFolderTree: useCallback((folder, children): GroupOption => ({ id: folder.id, label: folder.name, options: children }), []),
    buildFolderSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption => createUIOnlyMenuItemOption(`${id}-header`, { label: 'Folders', groupHeader: true }),
      []
    ),
    buildDataSeparator: useCallback(
      ([{ id }]: GroupOption[]): UIOnlyMenuItemOption => createUIOnlyMenuItemOption(`${id}-header`, { label, groupHeader: true }),
      []
    ),
    buildDataTree: useCallback(
      (workflow, _, cacheOption): GroupOption => {
        const options = Object.values(sharedNodes?.[workflow.diagramID] ?? {}).reduce<Array<BlockOption | GroupOption>>((acc, sharedNode) => {
          if (!sharedNode || (sharedNode.type !== BlockType.COMBINED && sharedNode.type !== BlockType.START)) return acc;
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
        }, []);

        return {
          id: workflow.id,
          label: workflow.name,
          options: [
            cacheOption(createUIOnlyMenuItemOption(`${workflow.id}-blocks-header`, { label: 'Blocks', groupHeader: true })),
            ...(!options.length
              ? [cacheOption(createUIOnlyMenuItemOption(`${workflow.id}-no-blocks`, { label: 'No blocks', isEmpty: true, disabled: true }))]
              : options),
          ],
        };
      },
      [sharedNodes]
    ),
  });
};
