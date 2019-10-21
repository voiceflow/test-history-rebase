import { BlockType } from '@/constants';
import { MergeStatus } from '@/containers/CanvasV2/constants';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';

import { EngineConsumer } from './utils';

const NON_MERGEABLE_BLOCKS = [BlockType.START, BlockType.COMMENT];

class MergeEngine extends EngineConsumer {
  status = null;

  target = null;

  predicates = [];

  get source() {
    return this.engine.drag.target;
  }

  get hasTarget() {
    return this.target !== null;
  }

  /**
   * normally the node that is dropped on will have the dropped node attached as the second step
   * if it is inverted, the dropped node will be the first step
   */
  get shouldInvert() {
    if (!this.hasTarget) {
      return false;
    }

    const sourceNode = this.engine.getNodeByID(this.source);
    if (sourceNode.type === BlockType.COMBINED) {
      return false;
    }

    const targetNode = this.engine.getNodeByID(this.target);
    return NODE_MANAGERS[targetNode.type].mergeTerminator;
  }

  isTarget(nodeID) {
    return this.target === nodeID;
  }

  prepare(target) {
    const sourceNode = this.engine.getNodeByID(this.source);
    if (sourceNode.type === BlockType.COMMENT) {
      return;
    }

    if (target === this.target) {
      return;
    }

    this.cancel();

    this.target = target;

    this.updateStatus();
  }

  confirm() {
    const source = this.source;
    const target = this.target;
    const shouldInvert = this.shouldInvert;
    const status = this.status;

    if (!this.hasTarget) {
      return;
    }

    this.clear();

    if (target && status === MergeStatus.ACCEPT) {
      if (shouldInvert) {
        this.engine.node.merge(target, source, true);
      } else {
        this.engine.node.merge(source, target);
      }
    }
  }

  cancel() {
    if (this.hasTarget) {
      this.setStatus(null);
      this.target = null;
    }
  }

  clear() {
    this.cancel();

    if (this.predicates.length) {
      this.predicates = [];
    }
  }

  getMergeStatus(sourceID, targetID) {
    const sourceNode = this.engine.getNodeByID(sourceID);
    const targetNode = this.engine.getNodeByID(targetID);

    if (NON_MERGEABLE_BLOCKS.includes(sourceNode.type) || NON_MERGEABLE_BLOCKS.includes(targetNode.type)) {
      return MergeStatus.DENY;
    }

    if (sourceNode.type === BlockType.COMBINED) {
      return MergeStatus.DENY;
    }

    const targetMergeTerminator = NODE_MANAGERS[targetNode.type].mergeTerminator;
    if (targetMergeTerminator) {
      return MergeStatus.DENY;
    }

    if (targetNode.type === BlockType.COMBINED) {
      if (
        NODE_MANAGERS[sourceNode.type].mergeTerminator &&
        NODE_MANAGERS[this.engine.getNodeByID(targetNode.combinedNodes[targetNode.combinedNodes.length - 1]).type].mergeTerminator
      ) {
        return MergeStatus.DENY;
      }

      if (sourceNode.ports.in.length === 0 && this.engine.getNodeByID(targetNode.combinedNodes[0]).ports.in.length === 0) {
        return MergeStatus.DENY;
      }

      return MergeStatus.COMBINED_ACCEPT;
    }

    return MergeStatus.ACCEPT;
  }

  updateStatus() {
    const nextStatus = this.shouldInvert ? this.getMergeStatus(this.target, this.source) : this.getMergeStatus(this.source, this.target);

    this.setStatus(nextStatus);
  }

  setStatus(status) {
    this.status = status;

    this.engine.node.setMergeStatus(this.source, status);
    this.engine.node.setMergeStatus(this.target, status);
  }

  generatePredicates(sourceNodeID) {
    this.predicates = Array.from(this.engine.getRootNodeIDs())
      .reverse()
      .reduce((acc, nodeID) => {
        if (nodeID !== sourceNodeID && this.engine.nodes.has(nodeID)) {
          const node = this.engine.getNodeByID(nodeID);

          if (!node.parentNode) {
            const { left, right, top, bottom } = this.engine.node.getBlockRect(node.id);

            acc.push({ id: node.id, left, right, top, bottom });
          }
        }

        return acc;
      }, [])
      .map(({ id, left, right, top, bottom }) => ({
        id,
        test: ([x, y]) => x >= left && x <= right && y >= top && y <= bottom,
      }));
  }
}

export default MergeEngine;
