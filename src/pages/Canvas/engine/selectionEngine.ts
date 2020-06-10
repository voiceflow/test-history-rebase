import { hasIdenticalMembers } from '@/utils/array';

import { ActivationMode } from './constants';
import { EngineConsumer } from './utils';

class SelectionEngine extends EngineConsumer {
  log = this.engine.log.child('selection');

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
   * check to see if the node is one of multiple selected
   */
  isOneOfManyTargets(nodeID: string) {
    return this.isTarget(nodeID) && this.engine.activation.getTargets().length > 1;
  }

  /**
   * returns array of all selected targets
   */
  getTargets() {
    return this.hasTargets ? this.engine.activation.getTargets() : [];
  }

  /**
   * toggle the selection of the node with the given ID
   */
  toggle(nodeID: string) {
    if (this.engine.isCanvasBusy) return;

    this.log.debug(this.log.pending('toggling selection of node'), this.log.slug(nodeID));

    if (this.engine.focus.hasTarget) {
      const focusTarget = this.engine.focus.getTarget()!;

      this.engine.focus.reset();
      this.engine.activation.activate(focusTarget, ActivationMode.SELECTION);

      if (nodeID === focusTarget) {
        this.log.info(this.log.success('switched node focus to selection'), this.log.slug(nodeID));
        return;
      }
    }

    this.engine.activation.toggle(nodeID, ActivationMode.SELECTION);

    const isSelected = this.isTarget(nodeID);
    this.log.info(this.log.success('toggled selection of node'), this.log.slug(nodeID), this.log.diff(!isSelected, isSelected));
  }

  /**
   * replace the entire set of selected targets
   */
  replace(targets: string[] = [], force = false) {
    const currentTargets = this.getTargets();

    if ((!force && this.engine.isCanvasBusy) || hasIdenticalMembers(targets, currentTargets)) return;

    this.log.debug(this.log.pending('replacing selection'), targets);
    this.engine.focus.reset();
    this.engine.activation.replace(targets, ActivationMode.SELECTION);

    this.log.info(this.log.success('replaced selection'), this.log.diff(currentTargets.length, targets.length));
  }

  /**
   * clears all selected nodes
   */
  reset() {
    if (!this.hasTargets) return;

    const currentTargets = this.getTargets();

    this.log.debug(this.log.pending('resetting selection'), currentTargets);
    this.engine.activation.reset();

    this.log.info(this.log.reset('reset selection'), this.log.diff(currentTargets.length, 0));
  }
}

export default SelectionEngine;
