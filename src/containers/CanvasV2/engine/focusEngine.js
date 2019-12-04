import { clearFocus, setFocus } from '@/ducks/creator';

import { ActivationMode } from './constants';
import { EngineConsumer } from './utils';

class FocusEngine extends EngineConsumer {
  /**
   * should be mutually exclusive with hasSelection
   */
  get hasTarget() {
    return this.engine.activation.mode === ActivationMode.FOCUS && this.engine.activation.hasTargets;
  }

  getTarget() {
    return this.hasTarget ? this.engine.activation.getTargets()[0] : null;
  }

  /**
   * check to see if the node is focused
   *
   * @param {string} nodeID
   * @returns {boolean}
   */
  isTarget(nodeID) {
    return this.hasTarget && this.engine.activation.isTarget(nodeID);
  }

  /**
   * focus the node with the given ID
   *
   * @param {string} nodeID
   * @param {{ renameActiveRevision: string }} options
   * @returns {void}
   */
  set(nodeID, { renameActiveRevision } = {}) {
    this.engine.activation.clear();
    this.engine.activation.activate(nodeID, ActivationMode.FOCUS);
    this.dispatch(setFocus(nodeID, renameActiveRevision));
  }

  clear() {
    if (this.hasTarget) {
      this.dispatch(clearFocus());
      this.engine.activation.clear();
    }
  }
}

export default FocusEngine;
