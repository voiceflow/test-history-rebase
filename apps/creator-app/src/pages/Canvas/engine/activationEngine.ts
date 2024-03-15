import { CANVAS_ACTIVATION_CLASSNAME } from '@/pages/Canvas/constants';

import { ActivationMode, EntityType } from './constants';
import { EngineConsumer } from './utils';

class ActivationEngine extends EngineConsumer {
  log = this.engine.log.child('activation');

  mode: ActivationMode | null = null;

  nodeTargets = new Set<string>();

  threadTargets = new Set<string>();

  private getTargetsSet(type: EntityType) {
    switch (type) {
      case EntityType.NODE:
        return this.nodeTargets;
      case EntityType.THREAD:
        return this.threadTargets;
      default:
        return new Set<string>();
    }
  }

  /**
   * should be mutually exclusive with hasFocus
   */
  hasTargets(type: EntityType): boolean {
    return this.getTargetsSet(type).size !== 0;
  }

  get hasAnyTargets(): boolean {
    return this.hasTargets(EntityType.NODE) || this.hasTargets(EntityType.THREAD);
  }

  /**
   * check to see if the node is activated
   */
  isTarget(type: EntityType, id: string) {
    return this.getTargetsSet(type).has(id);
  }

  getTargetsSize(type: EntityType) {
    return this.getTargetsSet(type).size;
  }

  /**
   * returns array of all activated targets
   */
  getTargets(type: EntityType) {
    return Array.from(this.getTargetsSet(type));
  }

  getAllTargets() {
    return [...this.getTargets(EntityType.NODE), ...this.getTargets(EntityType.THREAD)];
  }

  /**
   * switch the mode of the activation engine
   * this should clear any existing activation of a different type
   */
  setMode(mode: ActivationMode | null) {
    if (mode !== this.mode) {
      this.reset();
      this.mode = mode;
    }
  }

  addStyle() {
    this.engine.addClass(CANVAS_ACTIVATION_CLASSNAME);
  }

  removeStyle() {
    this.engine.removeClass(CANVAS_ACTIVATION_CLASSNAME);
  }

  /**
   * highlight the target with the given ID
   */
  activate(type: EntityType, targetID: string, mode = this.mode) {
    this.setMode(mode);
    this.getTargetsSet(type).add(targetID);

    if (type === EntityType.NODE) {
      this.log.debug('activated node', this.log.slug(targetID));

      this.engine.node.redraw(targetID);
      this.addStyle();
    } else if (type === EntityType.THREAD) {
      this.log.debug('activated thread', this.log.slug(targetID));

      this.engine.comment.forceRedrawThreads([targetID]);
      this.addStyle();
    }
  }

  /**
   * remove highlight of the node with the given ID
   */
  deactivate(type: EntityType, targetID: string) {
    this.getTargetsSet(type).delete(targetID);

    if (type === EntityType.NODE) {
      this.log.debug('deactivated node', this.log.slug(targetID));

      this.engine.node.redraw(targetID);
    } else if (type === EntityType.THREAD) {
      this.log.debug('deactivated thread', this.log.slug(targetID));

      this.engine.comment.forceRedrawThreads([targetID]);
    }

    if (!this.hasAnyTargets) {
      this.mode = null;
      this.removeStyle();
    }
  }

  /**
   * toggle the activation of the node with the given ID
   */
  toggleNode(nodeID: string, mode = this.mode) {
    this.setMode(mode);

    if (this.nodeTargets.has(nodeID)) {
      this.deactivate(EntityType.NODE, nodeID);
    } else {
      this.activate(EntityType.NODE, nodeID);
    }
  }

  /**
   * replace the entire set of activated targets
   */
  replace(type: EntityType, targetIDs: string[] = [], mode = this.mode) {
    this.setMode(mode);

    const targets = this.getTargetsSet(type);
    const unused = new Set(targets);

    targetIDs.forEach((targetID) => {
      if (!targets.has(targetID)) {
        this.activate(type, targetID);
      }
      unused.delete(targetID);
    });

    unused.forEach((targetID) => this.deactivate(type, targetID));

    if (this.hasAnyTargets) {
      this.addStyle();
    }
  }

  clear(type: EntityType) {
    // if there are any concerns regarding removing from a Set while iterating over it:
    // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
    this.getTargetsSet(type).forEach((nodeID) => this.deactivate(type, nodeID));
    this.getTargetsSet(type).clear();
  }

  /**
   * clears all active nodes
   */
  reset() {
    if (!this.hasAnyTargets) return;

    this.clear(EntityType.NODE);
    this.clear(EntityType.THREAD);

    this.log.debug('reset activation');
  }
}

export default ActivationEngine;
