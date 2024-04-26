import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { createCachedSelector } from '@/ducks/creatorV2/utils/selector';
import { idParamSelector } from '@/ducks/utils/crudV2';
import { useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import type { MarkupTransform } from '@/pages/Canvas/types';
import type { Pair, Point } from '@/types';
import type { Coords } from '@/utils/geometry';

import type Engine from '..';
import { EntityType } from '../constants';
import type { EntityInstance } from './entity';
import { ResourceEntity } from './entity';

export interface NodeInstance extends EntityInstance {
  ref: React.RefObject<HTMLElement>;

  /**
   * get the outer DOMRect of the rendered node
   */
  getRect: () => DOMRect | null;

  /**
   * get the current x and y position of this node on the canvas
   */
  getPosition: () => Point;

  /**
   * get the anchor coords for threads
   */
  getThreadAnchorCoords: () => Coords | null;

  /**
   * get the center point of the rendered node
   */
  getCenterPoint: () => Point | null;

  /**
   * select the name of the node for editing
   * if the node is a step, it will open the editor
   */
  rename: VoidFunction;

  /**
   * only Block nodes can be translated
   */
  translate?: (movement: Pair<number>, onStylesApplied?: VoidFunction) => void;

  /**
   * only Markup nodes expose a rect for transformation
   */
  getTransform?: () => MarkupTransform;

  /**
   * only Markup nodes can be rotated
   */
  rotate?: (angle: number) => void;

  /**
   * only Markup nodes can be scaled
   */
  scale?: (scale: Pair<number>, shift: Pair<number>) => void;

  /**
   * only Markup nodes can be scaled
   */
  scaleText?: (width: number, shift: Pair<number>) => void;

  /**
   * prepare the node for transformation
   *
   * only Markup nodes can be transformed
   */
  prepareForTransformation?: VoidFunction;

  /**
   * apply any outstanding transformations
   *
   * only Markup nodes can be transformed
   */
  applyTransformations?: () => Promise<void>;

  /**
   * for de-focusing blocks
   */
  blur?: VoidFunction;
}

export interface NodeEntityResource<T> {
  node: Realtime.Node;
  data: Realtime.NodeData<T>;
}

export const isNodeEntityResource = (info: any): info is NodeEntityResource<any> =>
  info?.data?.nodeID && info?.node?.type;

const nodeEntitySelector = createCachedSelector(
  [CreatorV2.nodeByIDSelector, CreatorV2.nodeDataByIDSelector, idParamSelector],
  (node, data) => ({
    node: node!,
    data: data!,
  })
)((_, params) => idParamSelector(_, params) || '');

class NodeEntity extends ResourceEntity<NodeEntityResource<unknown>, NodeInstance> {
  get isHighlighted() {
    return this.engine.highlight.isNodeTarget(this.nodeID);
  }

  get isActive() {
    return this.engine.activation.isTarget(EntityType.NODE, this.nodeID);
  }

  get isFocused() {
    return this.engine.focus.isTarget(this.nodeID);
  }

  get isSelected() {
    return this.engine.selection.isTarget(EntityType.NODE, this.nodeID);
  }

  get isDragging() {
    return this.engine.drag.isTarget(this.nodeID);
  }

  get isMergeTarget() {
    return this.engine.merge.targetNodeID === this.nodeID;
  }

  get isThreadTarget() {
    return this.engine.comment.isNodeTarget(this.nodeID);
  }

  get isTransformTarget() {
    return this.engine.transformation.isTarget(this.nodeID);
  }

  get isPrototypeHighlighted() {
    return this.engine.prototype.isNodeHighlightedLink(this.nodeID);
  }

  get isCanvasChipNode() {
    if (this.nodeType !== BlockType.COMBINED) return false;

    const {
      node: { combinedNodes },
    } = this.resolve<Realtime.NodeData.Combined>();

    if (combinedNodes.length !== 1) return false;

    const stepNode = this.engine.getNodeByID(combinedNodes[0]);

    return Realtime.Utils.typeGuards.isCanvasChipBlockType(stepNode?.type);
  }

  get lockOwner() {
    return this.engine.getLockOwner(this.nodeID);
  }

  nodeType: BlockType;

  inPortID: string | null;

  constructor(
    engine: Engine,
    public nodeID: string
  ) {
    super(EntityType.NODE, engine, engine.log.child('node', nodeID.slice(-6)));

    const { node } = this.resolve();

    this.nodeType = node.type;
    this.inPortID = node.ports.in.length ? node.ports.in[0] : null;

    this.log.debug(this.log.init('constructed node'), this.log.slug(nodeID));
  }

  resolve<T = unknown>(): NodeEntityResource<T> {
    return this.engine.select(nodeEntitySelector, { id: this.nodeID }) as NodeEntityResource<T>;
  }

  resolveLastCombinedLink(): Realtime.Link | null {
    const node = this.engine.select(CreatorV2.nodeByIDSelector, { id: this.nodeID });

    if (!node) return null;

    const linkIDs = this.engine.getLinkIDsByNodeID(node.combinedNodes[node.combinedNodes.length - 1] ?? null);

    return this.engine.getLinkByID(linkIDs[0]);
  }

  shouldUpdate() {
    return !!this.resolve().node;
  }

  isEqual = <T>(lhs: NodeEntityResource<T> | null, rhs: NodeEntityResource<T> | null) => {
    return (
      Object.is(lhs, rhs) ||
      (Utils.object.shallowEquals(lhs?.node ?? null, rhs?.node ?? null) &&
        Object.is(lhs?.data ?? null, rhs?.data ?? null))
    );
  };

  useInstance(instance: NodeInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.nodeID);

    React.useEffect(() => {
      engine.registerNode(this.nodeID, this);

      return () => {
        engine.expireNode(this.nodeID, this.instanceID);
      };
    }, []);
  }

  useCoordinates() {
    const { x, y } = this.useState((e) => {
      const { node } = e.resolve();

      return {
        x: node.x,
        y: node.y,
      };
    });

    return { x, y };
  }

  useLifecycle() {
    const engine = React.useContext(EngineContext)!;
    const { x, y } = this.useCoordinates();

    const { parentNode } = this.useState((e) => ({ parentNode: e.resolve().node.parentNode }));

    React.useEffect(() => engine.node.setOrigin(this.nodeID, [x, y]), [x, y]);

    React.useEffect(() => {
      engine.node.redrawNestedThreads(this.nodeID);
    }, [parentNode]);

    // redraw links in parent block when unmounting
    useTeardown(() => {
      if (parentNode) {
        engine.node.redrawNestedLinks(parentNode);
        engine.node.redrawNestedThreads(parentNode);
      }
    }, [parentNode]);
  }
}

export default NodeEntity;
