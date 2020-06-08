import React from 'react';
import { createSelector } from 'reselect';
import shallowEqual from 'shallowequal';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { useTeardown } from '@/hooks';
import { Node, NodeData } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { Pair, Point } from '@/types';

import { EntityType } from '../constants';
import type { Engine } from '..';
import { EntityInstance, ResourceEntity } from './entity';

export type NodeInstance = EntityInstance & {
  /**
   * get the outer DOMRect of the rendered node
   */
  getRect: () => DOMRect | null;

  /**
   * get the center point of the rendered node
   */
  getCenterPoint: () => Point | null;

  /**
   * select the name of the node for editing
   * if the node is a step, it will open the editor
   */
  rename: () => void;

  /**
   * only Block nodes can be translated
   */
  translate?: (movement: Pair<number>) => void;

  /**
   * only Markup nodes expose a rect for transformation
   */
  getTransformRect?: () => DOMRect | null;

  /**
   * only Markup nodes can be rotated
   */
  rotate?: (angle: number) => void;

  /**
   * only Markup nodes can be scaled
   */
  scale?: (delta: Pair<number>, offset: Pair<number>) => void;

  /**
   * create a snapshot of the current DOMRect to use for calculating transformations
   *
   * only Markup nodes can be snapshotted
   */
  snapshot?: () => void;

  /**
   * apply any outstanding transformations
   *
   * only Markup nodes can be transformed
   */
  applyTransformations?: () => void;
};

const nodeEntitySelector = createSelector([Creator.nodeByIDSelector, Creator.dataByNodeIDSelector], (getNode, getData) => (nodeID: string) => ({
  node: getNode(nodeID),
  data: getData(nodeID),
}));

class NodeEntity extends ResourceEntity<{ node: Node; data: NodeData<unknown> }, NodeInstance> {
  get isHighlighted() {
    return this.engine.highlight.isNodeTarget(this.nodeID);
  }

  get isActive() {
    return this.engine.activation.isTarget(this.nodeID);
  }

  get isFocused() {
    return this.engine.focus.isTarget(this.nodeID);
  }

  get isSelected() {
    return this.engine.selection.isTarget(this.nodeID);
  }

  get isDragging() {
    return this.engine.drag.isTarget(this.nodeID);
  }

  get isMergeTarget() {
    return this.engine.merge.targetNodeID === this.nodeID;
  }

  get isTransformTarget() {
    return this.engine.transformation.isTarget(this.nodeID);
  }

  get lockOwner() {
    return this.engine.getLockOwner(this.nodeID);
  }

  nodeType: BlockType;

  inPortID: string | null;

  constructor(engine: Engine, public nodeID: string) {
    super(EntityType.NODE, engine, engine.log.child(`node<${nodeID.slice(-6)}>`));

    const { node } = this.resolve();

    this.nodeType = node.type;
    this.inPortID = node.ports.in.length ? node.ports.in[0] : null;

    this.log.debug(this.log.init('constructed node'), this.log.slug(nodeID));
  }

  resolve<T = unknown>(): { node: Node; data: NodeData<T> } {
    return this.engine.select(nodeEntitySelector)(this.nodeID) as any;
  }

  shouldUpdate() {
    return !!this.resolve().node;
  }

  useInstance(instance: NodeInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.nodeID, () => this.resolve(), shallowEqual);

    React.useEffect(() => {
      engine.registerNode(this.nodeID, this);

      return () => {
        engine.expireNode(this.nodeID, this.instanceID);
      };
    }, []);
  }

  useLifecycle() {
    const engine = React.useContext(EngineContext)!;
    const parentNode = React.useMemo(() => this.resolve().node.parentNode, []);
    const { x, y } = this.useState((e) => {
      const { node } = e.resolve();

      return {
        x: node.x,
        y: node.y,
      };
    });

    React.useEffect(() => engine.node.setOrigin(this.nodeID, [x, y]), [x, y]);

    // redraw links in parent block when unmounting
    useTeardown(() => parentNode && engine.node.redrawNestedLinks(parentNode));
  }
}

export default NodeEntity;
