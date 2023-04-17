import * as Creator from '@/ducks/creator';

import { ActivationMode } from './constants';
import { EngineConsumer } from './utils';

class FocusEngine extends EngineConsumer {
  log = this.engine.log.child('focus');

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
  set(nodeID: string) {
    if (this.engine.isCanvasBusy || this.isTarget(nodeID)) return;

    this.log.debug(this.log.pending('focusing node'), this.log.slug(nodeID));
    this.engine.selection.reset();
    this.engine.activation.reset();
    this.engine.transformation.reset();

    this.engine.activation.activate(nodeID, ActivationMode.FOCUS);
    this.dispatch(Creator.setFocus(nodeID));
    this.engine.node.redrawLinks(nodeID);

    this.log.info(this.log.success('focused node'), this.log.slug(nodeID));
  }

  reset() {
    if (!this.hasTarget) return;

    const target = this.getTarget()!;

    this.log.debug(this.log.pending('resetting focus'), this.log.slug(target));
    this.dispatch(Creator.clearFocus());
    this.engine.activation.reset();
    this.engine.transformation.reset();
    this.engine.node.redrawLinks(target);

    this.log.info(this.log.reset('reset focus'), this.log.slug(target));
  }
}

export default FocusEngine;
