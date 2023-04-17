import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { createSelector } from 'reselect';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as ThreadV2 from '@/ducks/threadV2';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { Point } from '@/types';
import { Coords, Vector } from '@/utils/geometry';

import { CommentAPI } from '../../types';
import type Engine from '..';
import { EntityType } from '../constants';
import { EntityInstance, ResourceEntity } from './entity';

export interface ThreadInstance extends EntityInstance, CommentAPI {
  /**
   * get the current coordinates of this thread on the canvas
   */
  getCoords: () => Coords;

  translate: (movement: Vector) => Coords;

  forceRedraw: (nextCoords: Coords) => void;
}

const threadEntitySelector = createSelector(
  [CreatorV2.getNodeByIDSelector, ThreadV2.getThreadByIDSelector, CreatorV2.getLinksByPortIDSelector],
  (getNode, getThread, getLinksByPortID) => (threadID: string) => {
    const thread = getThread({ id: threadID })!;
    const node = getNode({ id: thread?.nodeID });
    const parentNode = getNode({ id: node?.parentNode });

    return {
      node,
      thread,
      parentNode,
      actionGrantParentNode:
        parentNode?.type === Realtime.BlockType.ACTIONS
          ? getNode({ id: getNode({ id: getLinksByPortID({ id: parentNode.ports.in[0] })[0]?.source.nodeID })?.parentNode })
          : null,
    };
  }
);

class ThreadEntity extends ResourceEntity<{ thread: Realtime.Thread; node: Realtime.Node | null }, ThreadInstance> {
  diagramID: string;

  threadOrder: number;

  get isFocused() {
    return this.engine.comment.isFocused(this.threadID);
  }

  constructor(engine: Engine, public threadID: string) {
    super(EntityType.THREAD, engine, engine.log.child('thread', threadID.slice(-6)));

    const { thread } = this.resolve();
    this.diagramID = thread.diagramID;
    this.threadOrder = this.getThreadOrder();

    this.log.debug(this.log.init('constructed thread'), this.log.slug(threadID));
  }

  resolve() {
    return this.engine.select(threadEntitySelector)(this.threadID);
  }

  getThreadOrder() {
    return this.engine.select(ThreadV2.threadOrder)(this.threadID);
  }

  shouldUpdate() {
    return !!this.resolve().thread;
  }

  calculateCoordinates(point: Point, nodeID: string | null) {
    if (nodeID) {
      const node = this.engine.node.api(nodeID);
      if (!node?.instance?.isReady()) {
        return new Coords([0, 0]);
      }

      const anchorCoords = node.instance.getThreadAnchorCoords()!;
      return anchorCoords.add(point).onPlane(this.engine.canvas!.getOuterPlane());
    }

    return this.engine.canvas!.toCoords(point).onPlane(this.engine.canvas!.getOuterPlane());
  }

  useCoordinates() {
    const { x, y, nodeID, parentNodeID, nodeX, nodeY, parentNodeX, parentNodeY, index } = this.useState((e) => {
      const { thread, node, parentNode, actionGrantParentNode } = e.resolve();

      return {
        nodeID: thread.nodeID,
        x: thread.position[0],
        y: thread.position[1],
        nodeX: node?.x,
        nodeY: node?.y,
        parentNodeID: actionGrantParentNode?.id ?? node?.parentNode,
        parentNodeX: actionGrantParentNode?.x ?? parentNode?.x,
        parentNodeY: actionGrantParentNode?.y ?? parentNode?.y,
        index: parentNode?.combinedNodes.indexOf(thread.nodeID!),
      };
    });

    return React.useMemo(
      () => this.calculateCoordinates([x, y], nodeID),
      [nodeID, x, y, parentNodeID, nodeX, nodeY, parentNodeX, parentNodeY, index]
    );
  }

  useInstance(instance: ThreadInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.threadID);

    React.useEffect(() => {
      engine.registerThread(this.threadID, this);

      return () => {
        engine.expireThread(this.threadID, this.instanceID);
      };
    }, []);
  }
}

export default ThreadEntity;
