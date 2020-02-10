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
   *
   * @param {string} nodeID
   * @returns {boolean}
   */
  isTarget(nodeID) {
    return this.hasTargets && this.engine.activation.isTarget(nodeID);
  }

  /**
   * returns array of all selected targets
   * @returns {array}
   */
  getTargets() {
    return this.hasTargets ? this.engine.activation.getTargets() : [];
  }

  /**
   * select and highlight the node with the given ID
   *
   * @param {string} nodeID
   * @returns {void}
   */
  select(nodeID) {
    this.engine.focus.clear();

    this.engine.activation.activate(nodeID, ActivationMode.SELECTION);
  }

  /**
   * deselect and remove highlight of the node with the given ID
   *
   * @param {string} nodeID
   * @returns {void}
   */
  deselect(nodeID) {
    this.engine.activation.deactivate(nodeID);
  }

  /**
   * toggle the selection of the node with the given ID
   *
   * @param {string} nodeID
   * @returns {void}
   */
  toggle(nodeID) {
    if (this.engine.focus.hasTarget) {
      const focusTarget = this.engine.focus.getTarget();
      this.engine.focus.clear();
      this.engine.activation.activate(focusTarget, ActivationMode.SELECTION);
    }

    this.engine.activation.toggle(nodeID, ActivationMode.SELECTION);
  }

  /**
   * replace the entire set of selected targets
   *
   * @param {string[]} targets
   * @returns {void}
   */
  replace(targets = []) {
    this.engine.focus.clear();

    this.engine.activation.replace(targets, ActivationMode.SELECTION);
  }

  /**
   * clears all selected nodes
   *
   * @returns {void}
   */
  clear() {
    if (this.hasTargets) {
      this.engine.activation.clear();
    }
  }
}

export default SelectionEngine;
