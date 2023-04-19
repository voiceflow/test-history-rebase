import { EmptyObject } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useTrackingEvents } from '@/hooks';
import { useActionsOptions } from '@/pages/Canvas/hooks/actions';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { PATH } from '../../constants';

interface ActionsOptions {
  editor: NodeEditorV2Props<unknown>;
  portID: string;
}

export const useActions = ({ editor, portID }: ActionsOptions) => {
  const [trackingEvents] = useTrackingEvents();

  const { options, targetNode, hasURLStep, lastCreatedStepID, hasNavigationStep, targetNodeIsActions, targetNodeSteps } = useActionsOptions({
    sourcePortID: portID,
    goToActions: ({ sourcePortID, actionNodeID }) => editor.goToNested({ path: PATH, params: { sourcePortID, actionNodeID } }),
  });

  const onRemove = async (_: number, item: Realtime.NodeData<EmptyObject>) => {
    const sourceNode = editor.engine.select(CreatorV2.nodeByPortIDSelector, { id: portID });

    await editor.engine.node.remove(item.nodeID);

    if (sourceNode) {
      trackingEvents.trackActionDeleted({ nodeType: sourceNode.type, actionType: item.type });
    }
  };

  const onRename = async (step: Realtime.NodeData<EmptyObject>, name: string) => {
    await editor.engine.node.updateData(step.nodeID, { name });
  };

  const onReorder = async (fromIndex: number, toIndex: number) => {
    if (!targetNode || !targetNodeSteps[fromIndex]) return;

    await editor.engine.node.relocate(targetNode.id, targetNodeSteps[fromIndex].nodeID, toIndex);
  };

  return {
    options,
    onRemove,
    onRename,
    onReorder,
    hasURLStep,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,
  };
};
