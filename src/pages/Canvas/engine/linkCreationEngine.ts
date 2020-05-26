import { Node } from '@/models';
import { Pair, Point } from '@/types';

import { CANVAS_CREATING_LINK_CLASSNAME } from '../constants';
import { EngineConsumer } from './utils';

export type NewLinkAPI = {
  show: () => void;
  hide: () => void;
  isPinned: () => boolean;
  pin: (position: [number, number]) => void;
  unpin: () => void;
};

class LinkCreationEngine extends EngineConsumer {
  log = this.engine.log.child('link-creation');

  sourcePortID: string | null = null;

  activeTargetPortID: string | null = null;

  newLink: NewLinkAPI | null = null;

  mouseOrigin: [number, number] | null = null;

  isCompleting = false;

  unpinTimeout = 0;

  get isDrawing() {
    return !!this.sourcePortID;
  }

  get hasPin() {
    return !!this.newLink?.isPinned();
  }

  addStyle() {
    this.engine.canvas?.addClass(CANVAS_CREATING_LINK_CLASSNAME);
  }

  removeStyle() {
    this.engine.canvas?.removeClass(CANVAS_CREATING_LINK_CLASSNAME);
  }

  isSourcePort(portID: string) {
    return portID === this.sourcePortID;
  }

  isSourceNode(nodeID: string) {
    const port = this.engine.getPortByID(this.sourcePortID!);

    return nodeID === port.nodeID;
  }

  canTargetNode(nodeID: string) {
    return this.isDrawing && !this.isSourceNode(nodeID);
  }

  registerNewLink(newLink: NewLinkAPI | null) {
    this.newLink = newLink;

    this.log.debug(this.log.init(newLink ? 'registered' : 'expired'), this.log.value('<NewLink>'));
  }

  containsSourcePort(nodeID: string) {
    const node: Node = this.engine.getNodeByID(nodeID);

    return this.isSourceNode(nodeID) || node?.combinedNodes.some((childNodeID) => this.isSourceNode(childNodeID));
  }

  async start(sourcePortID: string, mouseOrigin: [number, number]) {
    const linkIDs: string[] = this.engine.getLinkIDsByPortID(sourcePortID);

    this.log.debug(this.log.pending('starting to draw from port'), this.log.slug(sourcePortID));

    if (linkIDs.length) {
      await Promise.all(linkIDs.map((linkID) => this.engine.link.remove(linkID)));
    }

    this.addStyle();
    this.sourcePortID = sourcePortID;
    this.mouseOrigin = mouseOrigin;

    this.engine.highlight.setPortTarget(sourcePortID);
    this.newLink?.show();

    this.log.info(this.log.success('started drawing from port'), this.log.slug(sourcePortID));
  }

  async complete(targetPortID: string) {
    this.log.debug(this.log.pending('linking to port'), this.log.slug(targetPortID));

    this.isCompleting = true;

    await this.engine.link.add(this.sourcePortID!, targetPortID);

    this.abort();

    this.log.info(this.log.success('linked to port'), this.log.slug(targetPortID));
  }

  abort() {
    if (this.sourcePortID && this.engine.highlight.isLinkTarget(this.sourcePortID)) {
      this.engine.highlight.reset();
    }

    this.log.debug(this.log.pending('aborting link creation'), this.log.value(this.sourcePortID));
    this.newLink?.unpin();
    this.newLink?.hide();
    this.reset();

    this.log.info(this.log.reset('aborted link creation'));
  }

  pin(targetPortID: string, position: [number, number]) {
    this.log.debug(this.log.pending('pinning to port'), this.log.slug(targetPortID));
    clearTimeout(this.unpinTimeout);

    this.activeTargetPortID = targetPortID;
    this.newLink?.pin(position);

    this.log.debug(this.log.success('pinned to port'), this.log.slug(targetPortID));
  }

  unpin() {
    clearTimeout(this.unpinTimeout);

    this.unpinTimeout = setTimeout(() => {
      if (!this.activeTargetPortID) return;

      const targetPortID = this.activeTargetPortID;

      this.log.debug(this.log.pending('unpinning from port'), this.log.slug(targetPortID));
      this.activeTargetPortID = null;
      this.newLink?.unpin();

      this.log.debug(this.log.success('unpinned from port'), this.log.slug(targetPortID));
    }, 24);
  }

  getLinkPoints(): Pair<Point> | null {
    const rect = this.engine.port.getRect(this.sourcePortID!);

    if (!rect) return null;

    const { right, top, height } = rect;
    const startPoint: Point = [right, top + height / 2];
    const endPoint = this.mouseOrigin!;

    return [this.engine.canvas!.transformPoint(startPoint), this.engine.canvas!.transformPoint(endPoint, { relative: true })];
  }

  reset() {
    this.log.debug(this.log.pending('resetting link creation'));
    clearTimeout(this.unpinTimeout);

    this.engine.highlight.reset();
    this.removeStyle();

    this.sourcePortID = null;
    this.activeTargetPortID = null;
    this.mouseOrigin = null;
    this.isCompleting = false;

    this.log.debug(this.log.reset('reset link creation'));
  }
}

export default LinkCreationEngine;
