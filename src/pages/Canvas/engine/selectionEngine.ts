import { ActivationMode } from './constants';
import { EngineConsumer } from './utils';

class SelectionEngine extends EngineConsumer {
  /**
   * should be mutually exclusive with hasFocus
   */
  get hasTargets() {
    return this.engine.activation.mode === ActivationMode.SELECTION && this.engine.activation.hasTargets;
  }

  /**
   * check to see if the node is selected
   */
  isTarget(nodeID: string) {
    return this.hasTargets && this.engine.activation.isTarget(nodeID);
  }

  /**
   * returns array of all selected targets
   */
  getTargets() {
    return this.hasTargets ? this.engine.activation.getTargets() : [];
  }

  /**
   * select and highlight the node with the given ID
   */
  set(nodeID: string) {
    this.engine.focus.reset();

    this.engine.activation.activate(nodeID, ActivationMode.SELECTION);
  }

  /**
   * deselect and remove highlight of the node with the given ID
   */
  unset(nodeID: string) {
    this.engine.activation.deactivate(nodeID);
  }

  /**
   * toggle the selection of the node with the given ID
   */
  toggle(nodeID: string) {
    if (this.engine.focus.hasTarget) {
      const focusTarget = this.engine.focus.getTarget()!;

      this.engine.focus.reset();
      this.engine.activation.activate(focusTarget, ActivationMode.SELECTION);
    }

    this.engine.activation.toggle(nodeID, ActivationMode.SELECTION);
  }

  /**
   * replace the entire set of selected targets
   */
  replace(targets: string[] = []) {
    this.engine.focus.reset();

    this.engine.activation.replace(targets, ActivationMode.SELECTION);
  }

  /**
   * clears all selected nodes
   */
  reset() {
    if (this.hasTargets) {
      this.engine.activation.reset();
    }
  }
}

export default SelectionEngine;
