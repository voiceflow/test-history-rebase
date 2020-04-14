import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import { MergeLayerAPI } from '@/pages/Canvas/types';
import { withoutValue } from '@/utils/array';
import { isInRange } from '@/utils/number';

import { EngineConsumer } from './utils';

type MergeCandidate = {
  nodeID: string;
  containsPoint: (point: [number, number]) => boolean;
  isWithin: (rect: [[number, number], [number, number]]) => boolean;
};

const UNMERGEABLE_NODES = [BlockType.START, BlockType.COMMENT];

class MergeEngineV2 extends EngineConsumer {
  candidates: MergeCandidate[] = [];

  virtualSource: { type: BlockType; factoryData: Partial<NodeData<unknown>> } | null = null;

  targetStep: { index: number; reset: () => void } | null = null;

  sourceNodeID: string | null = null;

  targetNodeID: string | null = null;

  // eslint-disable-next-line lodash/prefer-constant
  isWithinTarget: ((point: [number, number]) => boolean) | null = null;

  mergeLayer: MergeLayerAPI | null = null;

  get hasSource() {
    return !!this.sourceNodeID || !!this.virtualSource;
  }

  get hasTargetStep() {
    return !!this.targetStep;
  }

  registerMergeLayer(mergeLayer: MergeLayerAPI | null) {
    this.mergeLayer = mergeLayer;
  }

  createBoundaryTest(nodeID: string) {
    const { left, right, top, bottom } = this.engine.node.getBlockRect(nodeID);

    return ([x, y]: [number, number]) => isInRange(x, left, right) && isInRange(y, top, bottom);
  }

  initialize(sourceNodeID: string) {
    const sourceNode = this.engine.getNodeByID(sourceNodeID);

    if (UNMERGEABLE_NODES.includes(sourceNode.type)) {
      return;
    }

    if (sourceNode.parentNode) {
      const mousePosition = this.engine.getCanvasMousePosition();
      const { x, y } = this.engine.node.api(sourceNodeID)?.ref.current.getBoundingClientRect();
      const [nodeX, nodeY] = this.engine.canvas.transformPoint([x, y]);

      const offset: [number, number] = [mousePosition[0] - nodeX, mousePosition[1] - nodeY];

      this.mergeLayer?.initialize(mousePosition, offset);
    }

    this.sourceNodeID = sourceNodeID;
    this.candidates = withoutValue(this.engine.getRootNodeIDs(), sourceNodeID)
      .reverse()
      .reduce<{ nodeID: string; top: number; left: number; bottom: number; right: number }[]>((acc, nodeID) => {
        if (nodeID !== sourceNodeID && this.engine.nodes.has(nodeID)) {
          const node = this.engine.getNodeByID(nodeID);

          const { left, right, top, bottom } = this.engine.node.getBlockRect(node.id);

          acc.push({
            nodeID: node.id,
            left,
            right,
            top,
            bottom,
          });
        }

        return acc;
      }, [])
      .map(({ nodeID, left, right, top, bottom }) => ({
        nodeID,
        containsPoint: ([x, y]) => isInRange(x, left, right) && isInRange(y, top, bottom),
        isWithin: ([[x1, y1], [x2, y2]]) =>
          (isInRange(left, x1, x2) || isInRange(right, x1, x2)) && (isInRange(top, y1, y2) || isInRange(bottom, y1, y2)),
      }));
  }

  updateTargetDetection() {
    this.isWithinTarget = this.createBoundaryTest(this.targetNodeID!);
  }

  updateCandidates() {
    const mousePosition = this.engine.mousePosition.current;

    const mergeTarget = this.candidates.find(({ containsPoint }) => containsPoint(mousePosition));

    if (this.isWithinTarget?.(mousePosition)) {
      this.updateTargetDetection();
      return;
    }

    if (mergeTarget) {
      this.setTarget(mergeTarget.nodeID, mergeTarget.containsPoint);
    }
  }

  async unmerge() {
    const mousePosition = this.engine.getCanvasMousePosition();

    if (!this.candidates.some(({ containsPoint }) => containsPoint(this.engine.mousePosition.current))) {
      await this.engine.node.unmerge(this.sourceNodeID, mousePosition);

      this.reset();
    }
  }

  setVirtualSource(type: BlockType, factoryData: Partial<NodeData<unknown>>) {
    this.virtualSource = { type, factoryData };
  }

  setTargetStep(index: number, reset: () => void) {
    if (this.targetStep?.index === index) return;

    this.clearTargetStep();

    this.targetStep = { index, reset };
  }

  setTarget(nodeID: string, isWithinTarget = this.createBoundaryTest(nodeID)) {
    if (nodeID === this.targetNodeID) return;

    this.clearTarget();

    this.targetNodeID = nodeID;
    this.isWithinTarget = isWithinTarget;

    this.engine.node.api(nodeID)?.setMergeTarget();
    this.mergeLayer?.setTransparent();
  }

  clearTargetStep() {
    if (this.targetStep) {
      this.targetStep.reset();
      this.targetStep = null;
    }
  }

  clearTarget() {
    this.clearTargetStep();

    if (this.targetNodeID) {
      this.engine.node.api(this.targetNodeID)?.clearMergeTarget();
      this.mergeLayer?.clearTransparent();
      this.targetNodeID = null;
      this.isWithinTarget = null;
    }
  }

  reset() {
    this.mergeLayer?.reset();
    this.clearTarget();

    this.sourceNodeID = null;
    this.virtualSource = null;
    this.candidates = [];
  }
}

export default MergeEngineV2;
