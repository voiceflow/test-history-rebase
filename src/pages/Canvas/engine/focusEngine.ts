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
   */
  isTarget(nodeID: string) {
    return this.hasTarget && this.engine.activation.isTarget(nodeID);
  }

  /**
   * focus the node with the given ID
   */
  set(nodeID: string, { renameActiveRevision }: { renameActiveRevision?: string } = {}) {
    this.engine.activation.reset();
    this.engine.activation.activate(nodeID, ActivationMode.FOCUS);
    this.dispatch(setFocus(nodeID, renameActiveRevision));
  }

  reset() {
    if (this.hasTarget) {
      this.dispatch(clearFocus());
      this.engine.activation.reset();
    }
  }
}

export default FocusEngine;
