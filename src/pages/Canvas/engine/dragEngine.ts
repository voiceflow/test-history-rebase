import * as Realtime from '@/ducks/realtime';
import { CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

import { EngineConsumer } from './utils';

const DRAG_LOCKS: Realtime.AnyNodeLock[] = [Realtime.LockType.MOVEMENT];

class DragEngine extends EngineConsumer {
  log = this.engine.log.child('drag');

  target: string | null = null;

  group: string[] | null = null;

  get hasTarget() {
    return this.target !== null;
  }

  get hasGroup() {
    return this.group !== null;
  }

  isSoleTarget(nodeID: string) {
    return this.target === nodeID;
  }

  isTarget(nodeID: string) {
    return this.isSoleTarget(nodeID) || !!this.group?.includes(nodeID);
  }

  addStyle() {
    this.engine.canvas?.addClass(CANVAS_DRAGGING_CLASSNAME);
  }

  removeStyle() {
    this.engine.canvas?.removeClass(CANVAS_DRAGGING_CLASSNAME);
  }

  async setGroup(nodeIDs: string[]) {
    if (this.group) return;

    this.group = nodeIDs;

    this.log.debug(this.log.pending('setting drag group'), nodeIDs);
    nodeIDs.forEach((nodeID) => this.engine.node.redraw(nodeID));
    await this.engine.realtime.sendUpdate(Realtime.lockNodes(nodeIDs, DRAG_LOCKS));
    this.addStyle();

    const focusedNode = this.engine.focus.getTarget();
    if (focusedNode && !nodeIDs.includes(focusedNode)) {
      this.engine.focus.reset();
    }

    this.log.info(this.log.success('set drag group'), this.log.value(nodeIDs.length));
  }

  async setTarget(nodeID: string) {
    if (nodeID === this.target) return;

    this.log.debug(this.log.pending('setting drag target'), this.log.slug(nodeID));
    await this.reset();

    this.engine.merge.initialize(nodeID);

    this.target = nodeID;

    this.engine.node.redraw(nodeID);
    await this.engine.realtime.sendUpdate(Realtime.lockNodes([nodeID], DRAG_LOCKS));
    this.addStyle();
    if (this.engine.focus.getTarget() !== nodeID) {
      this.engine.focus.reset();
    }

    this.log.info(this.log.success('set drag target'), this.log.slug(nodeID));
  }

  async reset() {
    if (this.hasTarget) {
      const target = this.target!;
      this.target = null;

      this.log.debug(this.log.pending('resetting drag target'), this.log.slug(target));
      this.engine.merge.reset();

      this.engine.node.redraw(target);
      await this.engine.node.translate(target, [0, 0], false);
      await this.engine.realtime.sendUpdate(Realtime.unlockNodes([target], DRAG_LOCKS));
      this.removeStyle();

      this.log.info(this.log.reset('reset drag target'), this.log.slug(target));
    }

    if (this.group) {
      const group = this.group;
      this.group = null;

      this.log.debug(this.log.pending('resetting drag group'), group);
      group.forEach((nodeID) => this.engine.node.redraw(nodeID));
      await this.engine.node.translateMany(group, [0, 0], false);
      await this.engine.realtime.sendUpdate(Realtime.unlockNodes(group, DRAG_LOCKS));
      this.removeStyle();

      this.log.info(this.log.reset('reset drag group'), this.log.diff(group.length, 0));
    }
  }
}

export default DragEngine;
