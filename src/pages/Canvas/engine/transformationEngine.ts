import { MARKUP_NODES } from '@/constants';
import { TransformOverlayAPI } from '@/pages/Canvas/types';
import { Pair } from '@/types';

import { EngineConsumer } from './utils';

class TransformationEngine extends EngineConsumer {
  log = this.engine.log.child('transformation');

  transformOverlay: TransformOverlayAPI | null = null;

  isActive = false;

  isTransforming = false;

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

    const rect = this.engine.node.api(nodeID)?.instance?.getTransformRect?.();
    if (!rect) return;

    this.log.debug(this.log.pending('setting tranformation target'), this.log.slug(nodeID));
    this.isActive = true;
    this.transformOverlay?.initialize(rect);

    this.log.info(this.log.success('set transformation target'), this.log.slug(nodeID));
  }

  reinitialize() {
    const rect = this.engine.node.api(this.getTarget()!)?.instance?.getTransformRect?.();
    if (!rect) return;

    this.transformOverlay?.initialize(rect);
  }

  start() {
    this.isTransforming = true;
  }

  scaleTarget(scale: Pair<number>, offset: Pair<number>) {
    this.engine.node.api(this.getTarget()!)?.instance?.scale?.(scale, offset);
  }

  rotateTarget(angle: number) {
    this.engine.node.api(this.getTarget()!)?.instance?.rotate?.(angle);
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

    this.log.info(this.log.reset('reset transformation'));
  }
}

export default TransformationEngine;
