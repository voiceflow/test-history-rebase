import * as Realtime from '@voiceflow/realtime-sdk';

import { CANVAS_DRAGGING_CLASSNAME } from '@/pages/Canvas/constants';

import { EngineConsumer } from './utils';

class DragEngine extends EngineConsumer {
  log = this.engine.log.child('drag');

  target: string | null = null;

  isDraggingToCreate = false;

  group: Record<string, string> | null = null;

  get hasTarget(): boolean {
    return this.target !== null;
  }

  get hasGroup(): boolean {
    return this.group !== null;
  }

  isSoleTarget(nodeID: string): boolean {
    return this.target === nodeID;
  }

  isInGroup(nodeID: string): boolean {
    return !!this.group?.[nodeID];
  }

  isTarget(nodeID: string): boolean {
    return this.isSoleTarget(nodeID) || this.isInGroup(nodeID);
  }

  addStyle(): void {
    this.engine.addClass(CANVAS_DRAGGING_CLASSNAME);
  }

  removeStyle(): void {
    this.engine.removeClass(CANVAS_DRAGGING_CLASSNAME);
  }

  setDraggingToCreate(val: boolean): void {
    this.isDraggingToCreate = val;
  }

  async setGroup(nodeIDs: string[]): Promise<void> {
    if (this.group) return;

    this.group = nodeIDs.reduce<Record<string, string>>((acc, nodeID) => Object.assign(acc, { [nodeID]: nodeID }), {});

    this.log.debug(this.log.pending('setting drag group'), nodeIDs);
    nodeIDs.forEach((nodeID) => this.engine.node.redraw(nodeID));

    await this.engine.components.diagramHeartbeat?.lockEntities(Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT, nodeIDs);
    this.addStyle();

    const focusedNode = this.engine.focus.getTarget();
    if (focusedNode && !nodeIDs.includes(focusedNode)) {
      this.engine.focus.reset();
    }

    this.log.info(this.log.success('set drag group'), this.log.value(nodeIDs.length));
  }

  async setTarget(nodeID: string): Promise<void> {
    if (nodeID === this.target) return;

    this.log.debug(this.log.pending('setting drag target'), this.log.slug(nodeID));
    await this.reset();

    this.engine.merge.initialize(nodeID);

    this.target = nodeID;

    this.engine.node.redraw(nodeID);

    await this.engine.components.diagramHeartbeat?.lockEntities(Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT, [nodeID]);

    this.addStyle();
    if (this.engine.focus.getTarget() !== nodeID) {
      this.engine.focus.reset();
    }

    this.log.info(this.log.success('set drag target'), this.log.slug(nodeID));
  }

  async reset(): Promise<void> {
    this.isDraggingToCreate = false;

    if (this.hasTarget) {
      const target = this.target!;
      this.target = null;

      this.log.debug(this.log.pending('resetting drag target'), this.log.slug(target));
      this.engine.merge.reset();

      this.engine.node.redraw(target);
      await this.engine.node.translate([target], [0, 0]);

      await this.engine.components.diagramHeartbeat?.unlockEntities(Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT, [target]);

      this.removeStyle();

      this.log.info(this.log.reset('reset drag target'), this.log.slug(target));
    }

    if (this.group) {
      const group = Object.values(this.group);
      this.group = null;

      this.log.debug(this.log.pending('resetting drag group'), group);
      group.forEach((nodeID) => this.engine.node.redraw(nodeID));
      await this.engine.node.translate(group, [0, 0]);

      await this.engine.components.diagramHeartbeat?.unlockEntities(Realtime.diagram.awareness.LockEntityType.NODE_MOVEMENT, group);

      this.removeStyle();

      this.log.info(this.log.reset('reset drag group'), this.log.diff(group.length, 0));
    }
  }
}

export default DragEngine;
