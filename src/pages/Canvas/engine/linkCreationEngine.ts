import { EngineConsumer } from './utils';

export type NewLinkAPI = {
  show: () => void;
  hide: () => void;
  pin: (position: [number, number]) => void;
  unpin: () => void;
};

class LinkCreationEngine extends EngineConsumer {
  sourcePortID: string | null = null;

  activeTargetPortID: string | null = null;

  newLink: NewLinkAPI | null = null;

  mouseOrigin: [number, number] | null = null;

  isCompleting = false;

  get isDrawing() {
    return !!this.sourcePortID;
  }

  registerNewLink(newLink: NewLinkAPI | null) {
    this.newLink = newLink;
  }

  isSourceNode(nodeID: string) {
    const port = this.engine.getPortByID(this.sourcePortID);

    return nodeID === port.nodeID;
  }

  async start(sourcePortID: string, mouseOrigin: [number, number]) {
    const linkIDs: string[] = this.engine.getLinkIDsByPortID(sourcePortID);

    if (linkIDs.length) {
      await Promise.all(linkIDs.map((linkID) => this.engine.link.remove(linkID)));
    }

    this.sourcePortID = sourcePortID;
    this.mouseOrigin = mouseOrigin;

    this.engine.port.api(sourcePortID)?.setHighlight?.();
    this.newLink?.show();
  }

  async complete(targetPortID: string) {
    this.isCompleting = true;

    await this.engine.link.add(this.sourcePortID, targetPortID);

    this.isCompleting = false;
    this.abort();
  }

  abort() {
    this.engine.port.api(this.sourcePortID)?.clearHighlight?.();
    this.newLink?.hide();
    this.sourcePortID = null;
    this.mouseOrigin = null;
  }

  pin(targetPortID: string, position: [number, number]) {
    this.activeTargetPortID = targetPortID;
    this.newLink?.pin(position);
  }

  unpin() {
    this.activeTargetPortID = null;
    this.newLink?.unpin();
  }

  getLinkEnd() {
    const { right, top, height } = this.engine.port.getRect(this.sourcePortID);

    const startPoint = [right, top + height / 2];
    const endPoint = this.mouseOrigin;

    return [this.engine.canvas.transformPoint(startPoint), this.engine.canvas.transformPoint(endPoint, true)];
  }
}

export default LinkCreationEngine;
