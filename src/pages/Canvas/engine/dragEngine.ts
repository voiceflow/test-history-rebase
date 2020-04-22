import * as Realtime from '@/ducks/realtime';

import { EngineConsumer } from './utils';

const DRAG_LOCKS: Realtime.AnyNodeLock[] = [Realtime.LockType.MOVEMENT];

class DragEngine extends EngineConsumer {
  target: string | null = null;

  group: string[] | null = null;

  get hasTarget() {
    return this.target !== null;
  }

  isTarget(nodeID: string) {
    return this.target === nodeID;
  }

  async setGroup(nodeIDs: string[]) {
    if (!this.group) {
      this.group = nodeIDs;

      await this.engine.realtime.sendUpdate(Realtime.lockNodes(nodeIDs, DRAG_LOCKS));
    }
  }

  async set(nodeID: string) {
    if (nodeID !== this.target) {
      await this.reset();

      this.engine.merge.initialize(nodeID);
      this.engine.node.drag(nodeID);

      this.target = nodeID;

      await this.engine.realtime.sendUpdate(Realtime.lockNodes([nodeID], DRAG_LOCKS));
    }
  }

  async reset() {
    if (this.hasTarget) {
      const target = this.target!;
      this.target = null;

      this.engine.node.drop(target);
      this.engine.merge.reset();

      await this.engine.node.translate(target, [0, 0], false);
      await this.engine.realtime.sendUpdate(Realtime.unlockNodes([target], DRAG_LOCKS));
    }

    if (this.group) {
      const group = this.group;
      this.group = null;

      await this.engine.node.translateMany(group, [0, 0], false);
      await this.engine.realtime.sendUpdate(Realtime.unlockNodes(group, DRAG_LOCKS));
    }
  }
}

export default DragEngine;
