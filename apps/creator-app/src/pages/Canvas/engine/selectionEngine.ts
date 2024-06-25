import { Utils } from '@voiceflow/common';

import type { SelectionSetTargetsContextValue } from '@/pages/Project/contexts';

import { ActivationMode, EntityType } from './constants';
import { EngineConsumer } from './utils';

class SelectionEngine extends EngineConsumer<{ selectionSetTargetsContext: SelectionSetTargetsContextValue }> {
  log = this.engine.log.child('selection');

  /**
   * should be mutually exclusive with hasFocus
   */
  hasTargets(type: EntityType): boolean {
    return this.engine.activation.mode === ActivationMode.SELECTION && this.engine.activation.hasTargets(type);
  }

  /**
   * should be mutually exclusive with hasFocus
   */
  get hasAnyTargets(): boolean {
    return this.engine.activation.mode === ActivationMode.SELECTION && this.engine.activation.hasAnyTargets;
  }

  /**
   * check to see if the node is selected
   */
  isTarget(type: EntityType, nodeID: string): boolean {
    return this.hasTargets(type) && this.engine.activation.isTarget(type, nodeID);
  }

  /**
   * check to see if the node is one of multiple selected
   */
  isOneOfManyTargets(type: EntityType, nodeID: string): boolean {
    return this.isTarget(type, nodeID) && this.engine.activation.getTargetsSize(type) > 1;
  }

  isOneOfAnyTargets(nodeID: string): boolean {
    const targets = this.engine.activation.getAllTargets();

    return targets.includes(nodeID) && targets.length > 1;
  }

  /**
   * returns array of all selected targets
   */
  getTargets(type: EntityType): string[] {
    return this.hasTargets(type) ? this.engine.activation.getTargets(type) : [];
  }

  getAllTargets(): string[] {
    return this.hasAnyTargets ? this.engine.activation.getAllTargets() : [];
  }

  /**
   * toggle the selection of the node with the given ID
   */
  toggleNode(nodeID: string): void {
    if (this.engine.isCanvasBusy) return;

    this.log.debug(this.log.pending('toggling selection of node'), this.log.slug(nodeID));

    if (this.engine.focus.hasTarget) {
      const focusTarget = this.engine.focus.getTarget()!;

      this.engine.focus.reset();
      this.engine.activation.activate(EntityType.NODE, focusTarget, ActivationMode.SELECTION);

      if (nodeID === focusTarget) {
        this.log.info(this.log.success('switched node focus to selection'), this.log.slug(nodeID));
        return;
      }
    }

    this.engine.activation.toggleNode(nodeID, ActivationMode.SELECTION);

    if (!this.engine.prototype.isActive) {
      this.components.selectionSetTargetsContext?.(this.getTargets(EntityType.NODE));
    }

    const isSelected = this.isTarget(EntityType.NODE, nodeID);
    this.log.info(
      this.log.success('toggled selection of node'),
      this.log.slug(nodeID),
      this.log.diff(!isSelected, isSelected)
    );
  }

  /**
   * replace the entire set of selected targets
   */
  replaceNode(targets: string[] = [], force = false): void {
    const currentTargets = this.getTargets(EntityType.NODE);

    if (
      (!force && this.engine.isCanvasBusy) ||
      this.engine.comment.isModeActive ||
      Utils.array.hasIdenticalMembers(targets, currentTargets)
    )
      return;

    this.log.debug(this.log.pending('replacing selection'), targets);
    this.engine.focus.reset();
    this.engine.activation.replace(EntityType.NODE, targets, ActivationMode.SELECTION);

    if (!this.engine.prototype.isActive) {
      this.components.selectionSetTargetsContext?.(this.getTargets(EntityType.NODE));
    }

    this.log.info(this.log.success('replaced selection'), this.log.diff(currentTargets.length, targets.length));
  }

  /**
   * clears all selected nodes
   */
  reset(): void {
    if (!this.hasTargets) return;

    const currentTargets = this.getAllTargets();

    this.log.debug(this.log.pending('resetting selection'), currentTargets);
    this.engine.activation.reset();
    this.components.selectionSetTargetsContext?.([]);

    this.log.info(this.log.reset('reset selection'), this.log.diff(currentTargets.length, 0));
  }
}

export default SelectionEngine;
