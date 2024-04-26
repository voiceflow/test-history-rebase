import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import _constant from 'lodash/constant';

import { BlockType } from '@/constants';
import { CANVAS_MERGING_CLASSNAME } from '@/pages/Canvas/constants';
import type { MergeLayerAPI } from '@/pages/Canvas/types';

import type { NodeCandidate } from './utils';
import { createBoundaryTest, EngineConsumer, getNodeCandidates } from './utils';

const UNMERGEABLE_NODES = new Set([BlockType.START]);

interface VirtualSourceExtra {
  nodes?: Realtime.NodeData<unknown>[];
  meta?: Record<string, any>;
}

class MergeEngine extends EngineConsumer<{ mergeLayer: MergeLayerAPI }> {
  log = this.engine.log.child('merge');

  candidates: NodeCandidate[] = [];

  virtualSource: {
    type: BlockType;
    factoryData: Partial<Realtime.NodeData<unknown>>;
    extra?: VirtualSourceExtra;
  } | null = null;

  targetStep: { index: number; reset: () => void } | null = null;

  sourceNodeID: string | null = null;

  targetNodeID: string | null = null;

  isWithinTarget: ((point: [number, number]) => boolean) | null = null;

  get hasSource() {
    return !!this.sourceNodeID || !!this.virtualSource;
  }

  get hasVirtualSource() {
    return !!this.virtualSource;
  }

  get hasTargetStep() {
    return !!this.targetStep;
  }

  createBoundaryTest(nodeID: string) {
    const rect = this.engine.node.getRect(nodeID);

    return rect ? createBoundaryTest(rect) : _constant(false);
  }

  initialize(sourceNodeID: string) {
    const sourceNode = this.engine.getNodeByID(sourceNodeID);
    if (!sourceNode) return;

    this.log.debug(this.log.pending('attempting initialization'), this.log.slug(sourceNodeID));

    if (UNMERGEABLE_NODES.has(sourceNode.type)) {
      this.log.debug(this.log.failure('initialization skipped - node cannot be targeted with merge operation'));

      return;
    }

    if (!this.engine.node.api(sourceNodeID)?.isReady()) {
      this.log.debug(this.log.failure('initialization skipped - node not ready'));

      return;
    }

    if (sourceNode.parentNode) {
      const mousePosition = this.engine.getCanvasMousePosition();
      const { x, y } = this.engine.node.getRect(sourceNodeID)!;
      const [nodeX, nodeY] = this.engine.canvas!.transformPoint([x, y]);

      const offset: [number, number] = [mousePosition[0] - nodeX, mousePosition[1] - nodeY];

      this.components.mergeLayer?.initialize(mousePosition, offset);

      this.log.debug(this.log.init('initializing merge layer'));
    }

    this.engine.addClass(CANVAS_MERGING_CLASSNAME);
    this.sourceNodeID = sourceNodeID;
    this.candidates = getNodeCandidates(
      [...Utils.array.withoutValue(this.engine.getRootNodeIDs(), sourceNodeID)].reverse(),
      this.engine
    );

    this.log.debug('discovered merge candidates', this.log.value(this.candidates.length));
    this.log.debug(this.log.init('merge system initialized for node'), this.log.slug(sourceNodeID));
  }

  refreshCandidateDetection(sourceNodeID: string) {
    this.candidates = getNodeCandidates(
      [...Utils.array.withoutValue(this.engine.getRootNodeIDs(), sourceNodeID)].reverse(),
      this.engine
    );
  }

  updateTargetDetection() {
    this.isWithinTarget = this.createBoundaryTest(this.targetNodeID!);
  }

  updateCandidates() {
    const mousePosition = this.engine.mousePosition.current!;

    this.log.debug(this.log.pending('updating candidates'));

    const mergeTarget = this.candidates.find(({ containsPoint }) => containsPoint(mousePosition));

    if (this.isWithinTarget?.(mousePosition)) {
      this.updateTargetDetection();
      this.log.debug(this.log.failure('no candidates updated - cursor is still within the currect target'));

      return;
    }

    if (mergeTarget) {
      this.setTarget(mergeTarget.nodeID, mergeTarget.containsPoint);
    } else {
      this.clearTarget();
    }
  }

  async unmerge() {
    const mousePosition = this.engine.getCanvasMousePosition();

    if (this.candidates.some(({ containsPoint }) => containsPoint(this.engine.mousePosition.current!))) return;

    const sourceNodeID = this.sourceNodeID!;

    this.log.debug(this.log.pending('unmerging node'), this.log.slug(sourceNodeID));
    this.reset();

    await this.engine.node.isolateStep(sourceNodeID, mousePosition);

    this.log.debug(this.log.success('unmerged node'), this.log.slug(sourceNodeID));
  }

  setVirtualSource<K extends keyof Realtime.NodeDataMap>(
    type: K,
    factoryData?: (Realtime.NodeDataMap[K] & Partial<Realtime.NodeData<{}>>) | Partial<Realtime.NodeData<unknown>>,
    extra: VirtualSourceExtra = {}
  ) {
    this.virtualSource = { type, factoryData: factoryData ?? {}, extra };
  }

  setTargetStep(index: number, reset: () => void) {
    if (this.targetStep?.index === index) return;

    this.log.debug(this.log.pending('setting merge target step'), this.log.value(index));
    this.clearTargetStep();

    this.targetStep = { index, reset };

    this.log.debug(this.log.success('set merge target step'), this.log.value(index));
  }

  setTarget(nodeID: string, isWithinTarget = this.createBoundaryTest(nodeID)) {
    if (nodeID === this.targetNodeID) return;

    this.log.debug(this.log.pending('setting merge target block'), this.log.slug(nodeID));
    this.clearTarget();

    this.targetNodeID = nodeID;
    this.isWithinTarget = isWithinTarget;

    this.engine.node.redraw(nodeID);
    this.components.mergeLayer?.setTransparent();

    this.log.debug(this.log.success('set merge target block'), this.log.slug(nodeID));
  }

  clearTargetStep() {
    if (!this.targetStep) return;

    this.log.debug(this.log.pending('clearing merge target step'), this.log.value(this.targetStep.index));

    this.targetStep.reset();
    this.targetStep = null;

    this.log.debug(this.log.reset('cleared merge target step'));
  }

  clearTarget() {
    this.clearTargetStep();

    if (!this.targetNodeID) return;

    const { targetNodeID } = this;

    this.log.debug(this.log.pending('clearing merge target block'), this.log.slug(targetNodeID));
    this.targetNodeID = null;
    this.isWithinTarget = null;

    this.components.mergeLayer?.clearTransparent();
    this.engine.node.redraw(targetNodeID);

    this.log.debug(this.log.reset('cleared merge target block'), this.log.slug(targetNodeID));
  }

  reset() {
    const candidateCount = this.candidates.length;

    this.log.debug(this.log.pending('resetting merge system'));
    this.components.mergeLayer?.reset();
    this.clearTarget();
    this.engine.removeClass(CANVAS_MERGING_CLASSNAME);

    this.sourceNodeID = null;
    this.virtualSource = null;
    this.candidates = [];

    this.log.debug(this.log.reset('reset merge system'), this.log.diff(candidateCount, 0));
  }
}

export default MergeEngine;
