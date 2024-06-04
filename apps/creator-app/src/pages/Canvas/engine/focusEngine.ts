import { matchPath } from 'react-router';

import { Path } from '@/config/routes';
import { Router } from '@/ducks';
import * as Creator from '@/ducks/creatorV2';

import { ActivationMode, EntityType } from './constants';
import { EngineConsumer } from './utils';

class FocusEngine extends EngineConsumer {
  log = this.engine.log.child('focus');

  /**
   * should be mutually exclusive with hasSelection
   */
  get hasTarget() {
    return this.engine.activation.mode === ActivationMode.FOCUS && this.engine.activation.hasTargets(EntityType.NODE);
  }

  getTarget() {
    return this.hasTarget ? this.engine.activation.getTargets(EntityType.NODE)[0] : null;
  }

  /**
   * check to see if the node is focused
   */
  isTarget(nodeID: string) {
    return this.hasTarget && this.engine.activation.isTarget(EntityType.NODE, nodeID);
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

    this.engine.activation.activate(EntityType.NODE, nodeID, ActivationMode.FOCUS);
    this.dispatch(Creator.setFocus(nodeID));
    this.engine.node.redrawLinks(nodeID);

    this.log.info(this.log.success('focused node'), this.log.slug(nodeID));
  }

  reset({ skipUrlSync }: { skipUrlSync?: boolean } = {}) {
    if (!this.hasTarget) return;

    const target = this.getTarget()!;

    this.log.debug(this.log.pending('resetting focus'), this.log.slug(target));
    this.dispatch(Creator.clearFocus());
    this.engine.activation.reset();
    this.engine.transformation.reset();
    this.engine.node.redrawLinks(target);

    if (!skipUrlSync && !!matchPath(this.select(Router.pathnameSelector), Path.CANVAS_NODE)) {
      this.engine.store.dispatch(Router.goToCurrentCanvas());
    }

    this.log.info(this.log.reset('reset focus'), this.log.slug(target));
  }
}

export default FocusEngine;
