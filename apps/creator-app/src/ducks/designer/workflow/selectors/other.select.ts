import { Flow } from '@voiceflow/dtos';
import { BlockType } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { sharedNodesSelector } from '@/ducks/diagramV2/selectors/base';
import { diagramIDParamSelector } from '@/ducks/utils';

import { getOneByID as getOneIntentByID } from '../../intent/selectors/crud.select';
import { createByFolderIDSelectors } from '../../utils/selector.util';
import { all, oneByID } from './crud.select';

export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(all);

export const nameByID = createSelector(oneByID, (flow) => flow?.name ?? null);

export const mapByDiagramID = createSelector(
  all,
  (flows): Partial<Record<string, Flow>> => Object.fromEntries(flows.map((flow) => [flow.diagramID, flow]))
);
export const oneByDiagramID = createSelector(mapByDiagramID, diagramIDParamSelector, (map, diagramID) => (diagramID ? map[diagramID] : null));

export const allOrderedByName = createSelector([all], (entities) => entities.sort((a, b) => a.name.localeCompare(b.name)));

type TriggerNode<Type extends BlockType, ExtraData = unknown> = {
  type: Type;
  label: string;
  nodeID: string;
  isEmpty: boolean;
} & ExtraData;

export const triggersMapByDiagramID = createSelector([sharedNodesSelector, getOneIntentByID], (sharedNodes, getOneIntentByID) => {
  const map: Partial<Record<string, Array<TriggerNode<BlockType.START> | TriggerNode<BlockType.INTENT, { intentID: string | null }>>>> = {};

  Object.entries(sharedNodes).forEach(([diagramID, diagramSharedNodes]) => {
    let diagramTriggers = map[diagramID];

    if (!diagramTriggers) {
      diagramTriggers = [];
      map[diagramID] = diagramTriggers;
    }

    Object.values(diagramSharedNodes).forEach((node) => {
      if (!node) return;

      if (node.type === BlockType.START) {
        diagramTriggers!.unshift({ type: node.type, label: node.name || 'Start', nodeID: node.nodeID, isEmpty: false });
      }

      if (node.type === BlockType.INTENT) {
        const intent = getOneIntentByID({ id: node.intentID });

        diagramTriggers!.push({
          type: node.type,
          label: intent?.name ?? 'Select intent...',
          nodeID: node.nodeID,
          isEmpty: !intent,
          intentID: node.intentID,
        });
      }
    });
  });

  return map;
});

export const nonEmptyTriggersMapByDiagramID = createSelector([triggersMapByDiagramID], (map) =>
  Object.fromEntries(Object.entries(map).map(([diagramID, triggers]) => [diagramID, triggers?.filter((trigger) => !trigger.isEmpty)]))
);
