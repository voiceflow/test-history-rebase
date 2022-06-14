import { CANVAS_MARKUP_TRANSFORMING_CLASSNAME } from '@/pages/Canvas/constants';
import { TransformOverlayAPI } from '@/pages/Canvas/types';
import { Pair } from '@/types';
import { isMarkupBlockType } from '@/utils/typeGuards';

import { EngineConsumer } from './utils';

class TransformationEngine extends EngineConsumer<{ transformOverlay: TransformOverlayAPI }> {
  log = this.engine.log.child('transformation');

  isActive = false;

  isTransforming = false;

  getTarget() {
    const nodeID = this.engine.focus.getTarget();
    const node = nodeID && this.engine.getNodeByID(nodeID);

    return this.isActive && node && isMarkupBlockType(node.type) ? nodeID : null;
  }

  isTarget(nodeID: string) {
    return nodeID === this.getTarget();
  }

  initialize(nodeID: string) {
    if (this.isTarget(nodeID)) return;

    const transform = this.engine.node.api(nodeID)?.instance?.getTransform?.();
    if (!transform) return;

    this.log.debug(this.log.pending('setting tranformation target'), this.log.slug(nodeID));
    this.isActive = true;
    this.components.transformOverlay?.initialize(transform);
    this.engine.addClass(CANVAS_MARKUP_TRANSFORMING_CLASSNAME);

    this.log.info(this.log.success('set transformation target'), this.log.slug(nodeID));
  }

  reinitialize() {
    const transform = this.engine.node.api(this.getTarget()!)?.instance?.getTransform?.();

    if (!transform) return;

    this.components.transformOverlay?.initialize(transform);
  }

  resizeOverlay(rect: DOMRectReadOnly) {
    this.components.transformOverlay?.resize(rect);
  }

  start() {
    this.isTransforming = true;

    this.engine.node.api(this.getTarget()!)?.instance?.prepareForTransformation?.();
  }

  scaleTarget(scale: Pair<number>, shift: Pair<number>, rotation: number, rotationOffset: Pair<number>) {
    this.engine.node.api(this.getTarget()!)?.instance?.scale?.(scale, shift, rotation, rotationOffset);
  }

  scaleTextTarget(maxWidth: number, shift: Pair<number>) {
    this.engine.node.api(this.getTarget()!)?.instance?.scaleText?.(maxWidth, shift);
  }

  rotateTarget(angle: number) {
    this.engine.node.api(this.getTarget()!)?.instance?.rotate?.(angle);
  }

  complete() {
    this.isTransforming = false;

    this.engine.node.api(this.getTarget()!)?.instance?.applyTransformations?.();

    this.components.transformOverlay?.clearTransformations();
  }

  reset() {
    if (!this.isActive) return;

    this.log.debug(this.log.pending('resetting transformation'));
    this.isActive = false;
    this.isTransforming = false;
    this.components.transformOverlay?.reset();
    this.engine.removeClass(CANVAS_MARKUP_TRANSFORMING_CLASSNAME);

    this.log.info(this.log.reset('reset transformation'));
  }
}

export default TransformationEngine;
