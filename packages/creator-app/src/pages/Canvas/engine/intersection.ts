import { CanvasAPI } from '@/components/Canvas';
import type { EmptyViewportSnackbarRef } from '@/pages/Canvas/components/EmptyViewportSnackbar';

import NodeEntity from './entities/nodeEntity';
import { EngineConsumer } from './utils';

// can't use interface here due to TS generics issue (extends Record<string, unknown> doesn't work with interfaces)
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Components = {
  emptyViewportSnackbar: EmptyViewportSnackbarRef;
};

class IntersectionEngine extends EngineConsumer<Components> {
  private emptyViewportIO: IntersectionObserver | null = null;

  private nodesVisibility: Record<string, boolean> = {};

  private emptyViewportSnackbarTimeout: number | null = null;

  private onEmptyViewport: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const nodeID = entry.target.getAttribute('data-node-id');

      if (!nodeID) return;

      this.nodesVisibility[nodeID] = entry.isIntersecting;
    });

    const viewportIsNotEmpty = Object.values(this.nodesVisibility).some((visible) => visible);

    if (viewportIsNotEmpty) {
      this.components.emptyViewportSnackbar?.hide();

      clearTimeout(this.emptyViewportSnackbarTimeout ?? 0);

      this.emptyViewportSnackbarTimeout = null;
    } else if (this.emptyViewportSnackbarTimeout === null) {
      this.emptyViewportSnackbarTimeout = window.setTimeout(() => {
        this.emptyViewportSnackbarTimeout = null;
        this.components.emptyViewportSnackbar?.show();
      }, 2000);
    }
  };

  public registerCanvas(canvas: CanvasAPI) {
    if (this.engine.isExport) return;

    this.emptyViewportIO = new IntersectionObserver(this.onEmptyViewport, { root: canvas.getRef(), threshold: [0, 1] });
  }

  public unregisterCanvas() {
    this.emptyViewportIO?.disconnect();

    this.emptyViewportIO = null;
    this.nodesVisibility = {};
    this.emptyViewportSnackbarTimeout = null;
  }

  public registerNode(entity: NodeEntity) {
    if (this.engine.isExport || !entity.instance?.ref.current) return;

    this.emptyViewportIO?.observe(entity.instance.ref.current);
  }

  public unregisterNode(entity: NodeEntity) {
    if (this.engine.isExport || !entity.instance?.ref.current) return;

    delete this.nodesVisibility[entity.nodeID];
    this.emptyViewportIO?.unobserve(entity.instance.ref.current);
  }

  public reset() {
    clearTimeout(this.emptyViewportSnackbarTimeout ?? 0);

    this.components.emptyViewportSnackbar?.hide();

    this.unregisterCanvas();
  }
}

export default IntersectionEngine;
