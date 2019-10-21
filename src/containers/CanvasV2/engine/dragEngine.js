import { EngineConsumer } from './utils';

class DragEngine extends EngineConsumer {
  target = null;

  get hasTarget() {
    return this.target !== null;
  }

  isTarget(nodeID) {
    return this.target === nodeID;
  }

  set(target) {
    if (target !== this.target) {
      this.clear();

      this.engine.merge.generatePredicates(target);
      this.engine.node.drag(target);
      this.target = target;
    }
  }

  clear() {
    if (this.hasTarget) {
      this.engine.node.drop(this.target);
      this.target = null;
    }
  }
}

export default DragEngine;
