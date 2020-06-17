import { BlockType, MARKUP_NODES } from '@/constants';
import { CANVAS_MARKUP_TRANSFORMING_CLASSNAME } from '@/pages/Canvas/constants';
import { TransformOverlayAPI } from '@/pages/Canvas/types';
import { Pair } from '@/types';

import { EngineConsumer } from './utils';

class TransformationEngine extends EngineConsumer {
  log = this.engine.log.child('transformation');

  transformOverlay: TransformOverlayAPI | null = null;

  isActive = false;

  isTransforming = false;

  addStyle() {
    this.engine.canvas?.addClass(CANVAS_MARKUP_TRANSFORMING_CLASSNAME);
  }

  removeStyle() {
    this.engine.canvas?.removeClass(CANVAS_MARKUP_TRANSFORMING_CLASSNAME);
  }

  getTarget() {
    const nodeID = this.engine.focus.getTarget();
    const node = nodeID && this.engine.getNodeByID(nodeID);

    return this.isActive && node && MARKUP_NODES.includes(node.type) ? nodeID : null;
  }

  isTarget(nodeID: string) {
    return nodeID === this.getTarget();
  }

  registerTransformOverlay(transformOverlay: TransformOverlayAPI | null) {
    this.transformOverlay = transformOverlay;

    this.log.debug(this.log.init(transformOverlay ? 'registered' : 'expired'), this.log.value('<TransformOverlay>'));
  }

  initialize(nodeID: string) {
    if (this.isTarget(nodeID)) return;

    const node = this.engine.getNodeByID(nodeID);
    if (node.type !== BlockType.MARKUP_TEXT) return;

    const transform = this.engine.node.api(nodeID)?.instance?.getTransform?.();
    if (!transform) return;

    this.log.debug(this.log.pending('setting tranformation target'), this.log.slug(nodeID));
    this.isActive = true;
    this.transformOverlay?.initialize(transform);
    this.addStyle();

    this.log.info(this.log.success('set transformation target'), this.log.slug(nodeID));
  }

  reinitialize() {
    const transform = this.engine.node.api(this.getTarget()!)?.instance?.getTransform?.();
    if (!transform) return;

    this.transformOverlay?.initialize(transform);
  }

  start() {
    this.isTransforming = true;

    this.engine.node.api(this.getTarget()!)?.instance?.snapshot?.();
  }

  scaleTarget(scale: Pair<number>, shift: Pair<number>) {
    this.engine.node.api(this.getTarget()!)?.instance?.scale?.(scale, shift);
  }

  scaleTextTarget(maxWidth: number) {
    this.engine.node.api(this.getTarget()!)?.instance?.scaleText?.(maxWidth);
  }

  rotateTarget(angle: number) {
    this.engine.node.api(this.getTarget()!)?.instance?.rotate?.(angle);
  }

  moveVertices(offset: Pair<number>, shift: Pair<number>) {
    this.engine.node.api(this.getTarget()!)?.instance?.moveVertices?.(offset, shift);
  }

  complete() {
    this.isTransforming = false;

    this.engine.node.api(this.getTarget()!)?.instance?.applyTransformations?.();

    this.transformOverlay?.clearTransformations();
  }

  reset() {
    if (!this.isActive) return;

    this.log.debug(this.log.pending('resetting transformation'));
    this.isActive = false;
    this.isTransforming = false;
    this.transformOverlay?.reset();
    this.removeStyle();

    this.log.info(this.log.reset('reset transformation'));
  }
}

export default TransformationEngine;
