import { ACTIVE_NODES_CANVAS_CLASSNAME } from '@/pages/Canvas/constants';

import { ActivationMode } from './constants';
import { EngineConsumer } from './utils';

class ActivationEngine extends EngineConsumer {
  targets = new Set<string>();

  mode: ActivationMode | null = null;

  /**
   * should be mutually exclusive with hasFocus
   */
  get hasTargets() {
    return this.targets.size !== 0;
  }

  /**
   * check to see if the node is activated
   */
  isTarget(nodeID: string) {
    return this.targets.has(nodeID);
  }

  /**
   * returns array of all activated targets
   */
  getTargets() {
    return Array.from(this.targets);
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

  addActiveStyle() {
    this.engine.canvas?.getRef().classList.add(ACTIVE_NODES_CANVAS_CLASSNAME);
  }

  removeActiveStyle() {
    this.engine.canvas?.getRef().classList.remove(ACTIVE_NODES_CANVAS_CLASSNAME);
  }

  redrawNode(nodeID: string) {
    this.engine.node.redraw(nodeID);
  }

  /**
   * highlight the node with the given ID
   */
  activate(nodeID: string, mode = this.mode) {
    this.setMode(mode);
    this.targets.add(nodeID);
    this.redrawNode(nodeID);

    if (this.engine.isRootNode(nodeID)) {
      this.addActiveStyle();
    }
  }

  /**
   * remove highlight of the node with the given ID
   */
  deactivate(nodeID: string) {
    this.targets.delete(nodeID);
    this.redrawNode(nodeID);

    if (!this.hasTargets) {
      this.mode = null;
      this.removeActiveStyle();
    }
  }

  /**
   * toggle the activation of the node with the given ID
   */
  toggle(nodeID: string, mode = this.mode) {
    this.setMode(mode);

    if (this.targets.has(nodeID)) {
      this.deactivate(nodeID);
    } else {
      this.activate(nodeID);
    }
  }

  /**
   * replace the entire set of activated targets
   */
  replace(targets: string[] = [], mode = this.mode) {
    this.setMode(mode);

    const unused = new Set(this.targets);

    targets.forEach((nodeID) => {
      if (!this.targets.has(nodeID)) {
        this.activate(nodeID);
      }
      unused.delete(nodeID);
    });

    unused.forEach((nodeID) => this.deactivate(nodeID));

    if (targets.length === 0) {
      this.removeActiveStyle();
    } else if (targets.some((nodeID) => this.engine.isRootNode(nodeID))) {
      this.addActiveStyle();
    }
  }

  /**
   * clears all active nodes
   */
  reset() {
    // if there are any concerns regarding removing from a Set while iterating over it:
    // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
    if (this.hasTargets) {
      this.targets.forEach((nodeID) => this.deactivate(nodeID));
      this.targets.clear();
      this.removeActiveStyle();
    }
  }
}

export default ActivationEngine;
