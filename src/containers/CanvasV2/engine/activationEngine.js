import { EngineConsumer } from './utils';

class ActivationEngine extends EngineConsumer {
  targets = new Set();

  mode = null;

  /**
   * should be mutually exclusive with hasFocus
   */
  get hasTargets() {
    return this.targets.size !== 0;
  }

  /**
   * check to see if the node is activated
   *
   * @param {string} nodeID
   * @returns {boolean}
   */
  isTarget(nodeID) {
    return this.targets.has(nodeID);
  }

  /**
   * returns array of all activated targets
   * @returns {array}
   */
  getTargets() {
    return Array.from(this.targets);
  }

  /**
   * switch the mode of the activation engine
   * this should clear any existing activation of a different type
   * @param {ActivationMode} mode
   * @returns {void}
   */
  setMode(mode) {
    if (mode !== this.mode) {
      this.clear();
      this.mode = mode;
    }
  }

  /**
   * highlight the node with the given ID
   *
   * @param {string} nodeID
   * @param {ActivationMode} mode
   * @returns {void}
   */
  activate(nodeID, mode = this.mode) {
    this.setMode(mode);
    this.engine.node.highlight(nodeID);
    this.targets.add(nodeID);
  }

  /**
   * remove highlight of the node with the given ID
   *
   * @param {string} nodeID
   * @returns {void}
   */
  deactivate(nodeID) {
    this.engine.node.clearHighlight(nodeID);
    this.targets.delete(nodeID);

    if (!this.hasTargets) {
      this.mode = null;
    }
  }

  /**
   * toggle the activation of the node with the given ID
   *
   * @param {string} nodeID
   * @param {ActivationMode} mode
   * @returns {void}
   */
  toggle(nodeID, mode = this.mode) {
    this.setMode(mode);

    if (this.targets.has(nodeID)) {
      this.deactivate(nodeID);
    } else {
      this.activate(nodeID);
    }
  }

  /**
   * replace the entire set of activated targets
   *
   * @param {string[]} targets
   * @param {ActivationMode} mode
   * @returns {void}
   */
  replace(targets = [], mode = this.mode) {
    this.setMode(mode);

    const unused = new Set(this.targets);

    targets.forEach((nodeID) => {
      if (!this.targets.has(nodeID)) {
        this.activate(nodeID);
      }
      unused.delete(nodeID);
    });

    unused.forEach((nodeID) => this.deactivate(nodeID));
  }

  /**
   * clears all active nodes
   *
   * @returns {void}
   */
  clear() {
    // if there are any concerns regarding removing from a Set while iterating over it:
    // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
    if (this.hasTargets) {
      this.targets.forEach((nodeID) => this.deactivate(nodeID));
      this.targets.clear();
    }
  }
}

export default ActivationEngine;
