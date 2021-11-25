import { RefObject } from 'react';

import { buildPath, getMarkerAttrs, getPathPoints, getVirtualPoints } from '@/pages/Canvas/components/Link';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import { CANVAS_CREATING_LINK_CLASSNAME } from '../constants';
import { EngineConsumer } from './utils';

class LinkCreationEngine extends EngineConsumer<{ newLink: NewLinkAPI }> {
  log = this.engine.log.child('link-creation');

  sourcePortID: string | null = null;

  linkEl: RefObject<SVGElement> | null = null;

  markerEl: RefObject<SVGMarkerElement> | null = null;

  activeTargetPortID: string | null = null;

  mouseOrigin: [number, number] | null = null;

  isCompleting = false;

  unpinTimeout: NodeJS.Timeout | null = null;

  get isDrawing() {
    return !!this.sourcePortID;
  }

  get hasPin() {
    return !!this.components.newLink?.isPinned();
  }

  isSourcePort(portID: string) {
    return portID === this.sourcePortID;
  }

  isSourceNode(nodeID: string) {
    const port = this.engine.getPortByID(this.sourcePortID!);

    return nodeID === port.nodeID;
  }

  setElements(linkEl: RefObject<SVGElement> | null, markerEl: RefObject<SVGMarkerElement> | null) {
    this.linkEl = linkEl;
    this.markerEl = markerEl;
  }

  redrawNewLink() {
    if (!this.markerEl?.current || !this.linkEl?.current) {
      return;
    }
    const isStraightLinks = this.engine.isStraightLinks();

    const [endX, endY] = this.engine.getCanvasMousePosition();
    const points = this.getLinkPoints();
    const start = points![0];
    const nextPoints: Pair<Point> = [start, [endX, endY]];
    const virtualPoints = getVirtualPoints(nextPoints)!;
    const pathPoints = getPathPoints(virtualPoints, { straight: isStraightLinks });
    const markerAttrs = getMarkerAttrs(pathPoints, isStraightLinks!);
    const path = buildPath(pathPoints, isStraightLinks!);

    this.linkEl.current.setAttribute('d', path);
    Object.keys(markerAttrs).forEach((attr) => this.markerEl!.current!.setAttribute(attr, markerAttrs[attr as keyof typeof markerAttrs]));
    this.engine.portLinkInstances.get(this.engine.linkCreation.sourcePortID!)?.api.updatePosition(pathPoints);
  }

  canTargetNode(nodeID: string) {
    return this.isDrawing && !this.isSourceNode(nodeID);
  }

  containsSourcePort(nodeID: string) {
    const node = this.engine.getNodeByID(nodeID);

    return this.isSourceNode(nodeID) || node?.combinedNodes.some((childNodeID) => this.isSourceNode(childNodeID));
  }

  async start(sourcePortID: string, mouseOrigin: [number, number]) {
    const linkIDs: string[] = this.engine.getLinkIDsByPortID(sourcePortID);

    this.log.debug(this.log.pending('starting to draw from port'), this.log.slug(sourcePortID));

    if (linkIDs.length) {
      await Promise.all(linkIDs.map((linkID) => this.engine.link.remove(linkID)));
    }

    this.engine.addClass(CANVAS_CREATING_LINK_CLASSNAME);
    this.sourcePortID = sourcePortID;
    this.mouseOrigin = mouseOrigin;

    this.engine.highlight.setPortTarget(sourcePortID);
    this.components.newLink?.show();

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
    this.components.newLink?.unpin();
    this.components.newLink?.hide();
    this.reset();

    this.log.info(this.log.reset('aborted link creation'));
  }

  pin(targetPortID: string, position: [number, number]) {
    this.log.debug(this.log.pending('pinning to port'), this.log.slug(targetPortID));
    this.clearUnpinTimeout();

    this.activeTargetPortID = targetPortID;
    this.components.newLink?.pin(position);

    this.log.debug(this.log.success('pinned to port'), this.log.slug(targetPortID));
  }

  unpin() {
    this.clearUnpinTimeout();

    this.unpinTimeout = setTimeout(() => {
      if (!this.activeTargetPortID) return;

      const targetPortID = this.activeTargetPortID;

      this.log.debug(this.log.pending('unpinning from port'), this.log.slug(targetPortID));
      this.activeTargetPortID = null;
      this.components.newLink?.unpin();

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

  clearUnpinTimeout() {
    if (this.unpinTimeout) {
      clearTimeout(this.unpinTimeout);
      this.unpinTimeout = null;
    }
  }

  reset() {
    this.log.debug(this.log.pending('resetting link creation'));

    if (this.unpinTimeout) {
      clearTimeout(this.unpinTimeout);
      this.unpinTimeout = null;
    }

    this.engine.highlight.reset();
    this.engine.removeClass(CANVAS_CREATING_LINK_CLASSNAME);
    this.sourcePortID = null;
    this.activeTargetPortID = null;
    this.mouseOrigin = null;
    this.isCompleting = false;

    this.log.debug(this.log.reset('reset link creation'));
  }
}

export default LinkCreationEngine;
