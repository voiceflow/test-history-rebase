import { FeatureFlag } from '@/config/features';
import * as Realtime from '@/ducks/realtime';

import { EngineConsumer } from './utils';

const DRAG_LOCKS = [Realtime.LockType.MOVEMENT];

class DragEngine extends EngineConsumer {
  target = null;

  group = null;

  get hasTarget() {
    return this.target !== null;
  }

  isTarget(nodeID) {
    return this.target === nodeID;
  }

  async setGroup(group) {
    if (!this.group) {
      this.group = group;

      await this.engine.realtime.sendUpdate(Realtime.lockNodes(group, DRAG_LOCKS));
    }
  }

  async set(target) {
    if (target !== this.target) {
      await this.clear();

      if (!this.isFeatureEnabled(FeatureFlag.BLOCK_REDESIGN)) {
        this.engine.merge.generatePredicates(target);
      }

      this.engine.node.drag(target);

      this.target = target;

      await this.engine.realtime.sendUpdate(Realtime.lockNodes([target], DRAG_LOCKS));
    }
  }

  async clear() {
    if (this.hasTarget) {
      const target = this.target;
      this.target = null;

      await this.engine.node.translate(target, [0, 0], false);
      await this.engine.realtime.sendUpdate(Realtime.unlockNodes([target], DRAG_LOCKS));
      this.engine.node.drop(target);
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
