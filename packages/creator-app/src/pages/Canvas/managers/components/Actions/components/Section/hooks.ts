import { EmptyObject, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import { useSelector, useTrackingEvents } from '@/hooks';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { PATH } from '../../constants';

interface ActionsOptions {
  editor: NodeEditorV2Props<unknown>;
  portID: string;
}

interface OnAddOptions extends ActionsOptions {
  targetNode: Realtime.Node<Realtime.BuiltInPortRecord<string>> | null;
  targetNodeSteps: Realtime.NodeData<EmptyObject>[];
  hasNavigationStep: boolean;
  targetNodeIsActions: boolean;
}

const useOnAddAction = ({ portID, editor, targetNode, targetNodeSteps, hasNavigationStep, targetNodeIsActions }: OnAddOptions) => {
  const [trackingEvents] = useTrackingEvents();

  const [lastCreatedStepID, setLastCreatedStepID] = React.useState<string | null>(null);

  const getNextActionIndex = (type: BlockType) => {
    if (!targetNodeIsActions) return 0;

    let index = targetNodeSteps.length;

    if (targetNodeSteps.some((step) => Realtime.Utils.typeGuards.isNavigationBlockType(step.type))) {
      if (Realtime.Utils.typeGuards.isNavigationBlockType(type)) {
        throw new Error("The actions can't have multiple navigation steps");
      }

      // navigation steps should always be last
      index -= 1;
    } else if (Realtime.Utils.typeGuards.isURLBlockType(type)) {
      if (targetNodeSteps.some((step) => Realtime.Utils.typeGuards.isURLBlockType(step.type))) {
        throw new Error("The actions can't have multiple url steps");
      }

      // url action should always be first
      index = 0;
    }

    return index;
  };

  const beforeAdd = async (index: number) => {
    // remove the link before creating an action node
    if (targetNode && !targetNodeIsActions) {
      const linkIDs = editor.engine.getLinkIDsByPortID(portID);

      if (linkIDs.length) {
        await editor.engine.link.removeMany(linkIDs).catch(Utils.functional.noop);
      }

      // remove the last action link before adding a new one
    } else if (targetNodeIsActions && targetNodeSteps.length && !hasNavigationStep && index) {
      const linkIDs = editor.engine.getLinkIDsByNodeID(targetNodeSteps[targetNodeSteps.length - 1].nodeID);

      if (linkIDs.length) {
        await editor.engine.link.removeMany(linkIDs);
      }
    }
  };

  const afterAdd = async ({ type, actionsNodeID }: { type: BlockType; actionsNodeID: string }) => {
    const sourceNode = editor.engine.select(CreatorV2.nodeByPortIDSelector, { id: portID });
    const actionsNodePorts = editor.engine.select(CreatorV2.portsByNodeIDSelector, { id: actionsNodeID });

    if (sourceNode) {
      trackingEvents.trackActionAdded({ nodeType: sourceNode.type, actionType: type });
    }

    // add the link to action node only if it is not linked yet
    if (!targetNodeIsActions && actionsNodePorts.in[0]) {
      await editor.engine.link.add(portID, actionsNodePorts.in[0]);
    }
  };

  const onAdd = async <K extends BlockType>(type: K, factoryData?: Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>) => {
    const index = getNextActionIndex(type);

    await beforeAdd(index);

    const nodeID = Utils.id.objectID();

    setLastCreatedStepID(nodeID);

    const { actionsNodeID } = await editor.engine.node.addActions(
      type,
      index,
      targetNodeIsActions ? targetNode?.id ?? null : null,
      { ...factoryData } as Partial<Realtime.NodeData<Realtime.NodeDataMap[K]>>,
      nodeID
    );

    if (type !== BlockType.EXIT) {
      editor.goToNested({ path: PATH, params: { sourcePortID: portID, actionNodeID: nodeID } });
    }

    await afterAdd({ type, actionsNodeID });
  };

  return {
    onAdd,
    lastCreatedStepID,
  };
};

export const useActions = ({ editor, portID }: ActionsOptions) => {
  const [trackingEvents] = useTrackingEvents();

  const targetNode = useSelector(CreatorV2.targetNodeByPortID, { id: portID });
  const domainsCount = useSelector(Domain.domainsCountSelector);
  const targetNodeSteps = useSelector(CreatorV2.stepDataByParentNodeIDSelector, { id: targetNode?.id });

  const hasURLStep = Realtime.Utils.typeGuards.isURLBlockType(targetNodeSteps[0]?.type);
  const canHaveURLStep =
    Realtime.Utils.typeGuards.isButtonsBlockType(editor.data.type) ||
    Realtime.Utils.typeGuards.isCarouselBlockType(editor.data.type) ||
    Realtime.Utils.typeGuards.isCardV2BlockType(editor.data.type);
  const hasNavigationStep = Realtime.Utils.typeGuards.isNavigationBlockType(targetNodeSteps[targetNodeSteps.length - 1]?.type);

  const targetNodeIsActions = targetNode?.type === BlockType.ACTIONS;

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

  const { onAdd, lastCreatedStepID } = useOnAddAction({
    portID,
    editor,
    targetNode,
    targetNodeSteps,
    hasNavigationStep,
    targetNodeIsActions,
  });

  return {
    onAdd,
    onRemove,
    onRename,
    onReorder,
    hasURLStep,
    canHaveURLStep,
    withGoToDomain: domainsCount > 1,
    targetNodeSteps,
    hasNavigationStep,
    lastCreatedStepID,
    targetNodeIsActions,
  };
};
