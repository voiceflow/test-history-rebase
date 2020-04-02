import { BlockType } from '@/constants';
import { MergeLayerAPI } from '@/pages/Canvas/types';
import { findUnion, withoutValue } from '@/utils/array';
import { isInRange } from '@/utils/number';

import { EngineConsumer } from './utils';

type MergeCandidate = {
  nodeID: string;
  containsPoint: (point: [number, number]) => boolean;
  boundaryContainsPoint: (point: [number, number]) => boolean;
  isWithin: (rect: [[number, number], [number, number]]) => boolean;
};

const ACTTIVATION_BOUNDARY_WIDTH = 100;
const DEACTTIVATION_BOUNDARY_WIDTH = 20;
const UNMERGEABLE_NODES = [BlockType.START, BlockType.COMMENT];

class MergeEngineV2 extends EngineConsumer {
  candidates: MergeCandidate[] = [];

  activated: string[] = [];

  sourceNodeID: string | null = null;

  targetNodeID: string | null = null;

  // eslint-disable-next-line lodash/prefer-constant
  isWithinTarget: ((point: [number, number]) => boolean) | null = null;

  mergeLayer: MergeLayerAPI | null = null;

  registerMergeLayer(mergeLayer: MergeLayerAPI | null) {
    this.mergeLayer = mergeLayer;
  }

  initialize(sourceNodeID: string) {
    const boundaryWidth = ACTTIVATION_BOUNDARY_WIDTH * this.engine.canvas.getZoom();
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
        boundaryContainsPoint: ([x, y]) =>
          isInRange(x, left - boundaryWidth, right + boundaryWidth) && isInRange(y, top - boundaryWidth, bottom + boundaryWidth),
        isWithin: ([[x1, y1], [x2, y2]]) =>
          (isInRange(left, x1, x2) || isInRange(right, x1, x2)) && (isInRange(top, y1, y2) || isInRange(bottom, y1, y2)),
      }));
  }

  updateTargetDetection() {
    const { left, right, top, bottom } = this.engine.node.getBlockRect(this.targetNodeID);
    const boundaryWidth = DEACTTIVATION_BOUNDARY_WIDTH * this.engine.canvas.getZoom();

    this.isWithinTarget = ([x, y]) =>
      isInRange(x, left - boundaryWidth, right + boundaryWidth) && isInRange(y, top - boundaryWidth, bottom + boundaryWidth);
  }

  updateCandidates() {
    const mousePosition = this.engine.mousePosition.current;
    const mergeTarget = this.candidates.find(({ containsPoint }) => containsPoint(mousePosition));

    if (this.isWithinTarget?.(mousePosition)) {
      this.updateTargetDetection();
      return;
    }

    if (this.targetNodeID && this.targetNodeID !== mergeTarget?.nodeID) {
      this.clearActiveTarget();
    }

    if (mergeTarget) {
      this.clearActiveCandidates();

      this.targetNodeID = mergeTarget.nodeID;
      this.isWithinTarget = mergeTarget.containsPoint;
      this.engine.node.api(this.targetNodeID)?.setMergeTarget();

      return;
    }

    const activeCandidates = this.candidates.filter(({ boundaryContainsPoint }) => boundaryContainsPoint(mousePosition)).map(({ nodeID }) => nodeID);

    if (activeCandidates.length) {
      const { lhsOnly: newTargets, rhsOnly: oldTargets } = findUnion(activeCandidates, this.activated);

      newTargets.forEach((nodeID) => this.engine.node.api(nodeID)?.setMergeCandidate());
      oldTargets.forEach((nodeID) => this.engine.node.api(nodeID)?.clearMergeCandidate());

      this.activated = activeCandidates;
    } else {
      this.clearActiveCandidates();
    }
  }

  async unmerge() {
    const mousePosition = this.engine.getCanvasMousePosition();

    if (!this.candidates.some(({ containsPoint }) => containsPoint(this.engine.mousePosition.current))) {
      await this.engine.node.unmerge(this.sourceNodeID, mousePosition);

      this.reset();
    }
  }

  clearActiveCandidates() {
    this.activated.forEach((nodeID) => this.engine.node.api(nodeID)?.clearMergeCandidate());
    this.activated = [];
  }

  clearActiveTarget() {
    if (this.targetNodeID) {
      this.engine.node.api(this.targetNodeID)?.clearMergeTarget();
      this.targetNodeID = null;
      this.isWithinTarget = null;
    }
  }

  reset() {
    this.mergeLayer?.reset();
    this.clearActiveCandidates();
    this.clearActiveTarget();

    this.sourceNodeID = null;
    this.candidates = [];
  }
}

export default MergeEngineV2;
