import { CANVAS_COMMENTING_ENABLED } from '@/pages/Canvas/constants';

import { EngineConsumer } from './utils';

class CommentEngine extends EngineConsumer {
  private isEnabled = false;

  enable() {
    this.engine.canvas?.addClass(CANVAS_COMMENTING_ENABLED);

    this.isEnabled = true;
  }

  disable() {
    this.engine.canvas?.removeClass(CANVAS_COMMENTING_ENABLED);

    this.isEnabled = false;
  }

  getIsOpened() {
    return this.isEnabled;
  }
}

export default CommentEngine;
