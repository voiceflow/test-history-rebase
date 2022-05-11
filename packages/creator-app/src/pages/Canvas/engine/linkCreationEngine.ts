import { Utils } from '@voiceflow/common';
import { RefObject } from 'react';

import { BlockType } from '@/constants';
import { buildPath, getMarkerAttrs, getPathPointsV2, LinkedRects } from '@/pages/Canvas/components/Link';
import { NewLinkAPI } from '@/pages/Canvas/types';

import { CANVAS_CREATING_LINK_CLASSNAME } from '../constants';
import { EngineConsumer, toCanvasRect } from './utils';

class LinkCreationEngine extends EngineConsumer<{ newLink: NewLinkAPI }> {
  log = this.engine.log.child('link-creation');

  linkEl: RefObject<SVGElement> | null = null;

  markerEl: RefObject<SVGMarkerElement> | null = null;

  isCompleting = false;

  unpinTimeout: NodeJS.Timeout | null = null;

  sourcePortID: string | null = null;

  mousePositionRect = new DOMRect(0, 0, 0, 0);

  sourceNodeIsStart = false;

  sourceNodeIsAction = false;

  activeTargetPortID: string | null = null;

  targetNodeIsCombined = false;

  get isDrawing(): boolean {
    return !!this.sourcePortID;
  }

  get hasPin(): boolean {
    return !!this.components.newLink?.isPinned();
  }

  getMousePositionRect(mousePosition = this.engine.getCanvasMousePosition()): DOMRect {
    [this.mousePositionRect.x, this.mousePositionRect.y] = mousePosition;

    return this.mousePositionRect;
  }

  isSourcePort(portID: string): boolean {
    return portID === this.sourcePortID;
  }

  isSourceNode(nodeID: string): boolean {
    const port = this.engine.getPortByID(this.sourcePortID!);
    if (!port) return false;

    return nodeID === port.nodeID;
  }

  setElements(linkEl: RefObject<SVGElement> | null, markerEl: RefObject<SVGMarkerElement> | null): void {
    this.linkEl = linkEl;
    this.markerEl = markerEl;
  }

  redrawNewLink(linkedRects?: LinkedRects | null, options?: { isConnected?: boolean }): void {
    if (!this.markerEl?.current || !this.linkEl?.current || !this.engine.linkCreation.sourcePortID) return;

    let localLinkedRects = linkedRects;

    if (!localLinkedRects) {
      localLinkedRects = this.getLinkedRects(this.getMousePositionRect(), { relative: true, targetIsCanvasRect: true });
      if (!localLinkedRects) return;
    }

    const markerNode = this.markerEl.current;
    const isStraight = this.engine.isStraightLinks();

    const pathPoints = getPathPointsV2(localLinkedRects, {
      isStraight,
      isConnected: options?.isConnected ?? false,
      sourceNodeIsStart: this.sourceNodeIsStart,
      sourceNodeIsAction: this.sourceNodeIsAction,
      targetNodeIsCombined: options?.isConnected ? this.targetNodeIsCombined : false,
      sourceParentNodeRect: this.getSourceParentNodeRect(),
    });

    const path = buildPath(pathPoints, { isStraight });
    const markerAttrs = getMarkerAttrs(pathPoints, { isStraight });

    this.linkEl.current.setAttribute('d', path);
    this.engine.portLinkInstances.get(this.engine.linkCreation.sourcePortID)?.api.updatePosition(pathPoints);

    Utils.object.getKeys(markerAttrs).forEach((attr) => markerNode.setAttribute(attr, markerAttrs[attr]));
  }

  canTargetNode(nodeID: string): boolean {
    return this.isDrawing && !this.isSourceNode(nodeID);
  }

  containsSourcePort(nodeID: string): boolean {
    const node = this.engine.getNodeByID(nodeID);

    return this.isSourceNode(nodeID) || !!node?.combinedNodes.some((childNodeID) => this.isSourceNode(childNodeID));
  }

  start(sourcePortID: string, mouseOrigin: [number, number]): void {
    const linkIDs = this.engine.getLinkIDsByPortID(sourcePortID);

    this.log.debug(this.log.pending('starting to draw from port'), this.log.slug(sourcePortID));

    if (linkIDs.length) {
      // not waiting for this to avoid any hitches while drawing
      // creating a new link will also overwrite the old link data which should be safe
      this.engine.link.removeMany(linkIDs).catch((err) => this.log.error('failed to remove link', err));
    }

    this.engine.addClass(CANVAS_CREATING_LINK_CLASSNAME);
    this.sourcePortID = sourcePortID;

    const sourcePort = this.engine.getPortByID(sourcePortID);

    if (sourcePort) {
      const sourceNode = this.engine.getNodeByID(sourcePort.nodeID);

      this.sourceNodeIsStart = sourceNode?.type === BlockType.START;

      // TODO: replace with the BlockType.ACTIONS
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.sourceNodeIsAction = sourceNode?.type === 'actions';
    }

    this.engine.highlight.setPortTarget(sourcePortID);
    this.components.newLink?.show(this.getMousePositionRect(mouseOrigin));

    this.log.info(this.log.success('started drawing from port'), this.log.slug(sourcePortID));
  }

  async complete(targetPortID: string): Promise<void> {
    if (!this.sourcePortID || this.isCompleting) return;

    this.log.debug(this.log.pending('linking to port'), this.log.slug(targetPortID));

    this.isCompleting = true;

    try {
      await this.engine.link.add(this.sourcePortID, targetPortID);

      this.abort();
    } catch {
      this.isCompleting = false;
    }

    this.log.info(this.log.success('linked to port'), this.log.slug(targetPortID));
  }

  abort(): void {
    if (this.sourcePortID && this.engine.highlight.isLinkTarget(this.sourcePortID)) {
      this.engine.highlight.reset();
    }

    this.log.debug(this.log.pending('aborting link creation'), this.log.value(this.sourcePortID));
    this.components.newLink?.unpin();
    this.components.newLink?.hide();
    this.reset();

    this.log.info(this.log.reset('aborted link creation'));
  }

  pin(targetPortID: string, rect: DOMRect): void {
    if (this.isCompleting) return;

    this.log.debug(this.log.pending('pinning to port'), this.log.slug(targetPortID));
    this.clearUnpinTimeout();

    this.activeTargetPortID = targetPortID;

    const targetPort = this.engine.getPortByID(targetPortID);

    if (targetPort) {
      const targetNode = this.engine.getNodeByID(targetPort.nodeID);

      this.targetNodeIsCombined = targetNode?.type === BlockType.COMBINED;
    }

    this.components.newLink?.pin(rect);

    this.log.debug(this.log.success('pinned to port'), this.log.slug(targetPortID));
  }

  unpin(): void {
    if (this.isCompleting) return;

    this.clearUnpinTimeout();

    this.unpinTimeout = setTimeout(() => {
      if (!this.activeTargetPortID) return;

      const targetPortID = this.activeTargetPortID;

      this.log.debug(this.log.pending('unpinning from port'), this.log.slug(targetPortID));
      this.activeTargetPortID = null;
      this.targetNodeIsCombined = false;
      this.components.newLink?.unpin();

      this.log.debug(this.log.success('unpinned from port'), this.log.slug(targetPortID));
    }, 24);
  }

  getLinkedRects(targetRect: DOMRect, { relative, targetIsCanvasRect }: { relative: boolean; targetIsCanvasRect: boolean }): LinkedRects | null {
    if (!this.sourcePortID || !this.engine.canvas) return null;

    const port = this.engine.getPortByID(this.sourcePortID);

    if (!port) return null;

    const sourcePortRect = this.engine.port.getRect(port.id);
    const sourceNodeRect = this.engine.node.getRect(port.nodeID);

    if (!sourcePortRect || !sourceNodeRect) return null;

    return {
      sourcePortRect: toCanvasRect(this.engine.canvas, sourcePortRect),
      sourceNodeRect: toCanvasRect(this.engine.canvas, sourceNodeRect),
      targetPortRect: targetIsCanvasRect ? targetRect : toCanvasRect(this.engine.canvas, targetRect, { relative }),
      targetNodeRect: targetIsCanvasRect ? targetRect : toCanvasRect(this.engine.canvas, targetRect, { relative }),
    };
  }

  getSourceParentNodeRect(): DOMRect | null {
    if (!this.sourcePortID || !this.engine.canvas) return null;

    const port = this.engine.getPortByID(this.sourcePortID);

    if (!port) return null;

    const node = this.engine.getNodeByID(port.nodeID);

    if (!node?.parentNode) return null;

    const sourceParentNodeRect = this.engine.node.getRect(node.parentNode);

    if (!sourceParentNodeRect) return null;

    return toCanvasRect(this.engine.canvas, sourceParentNodeRect);
  }

  clearUnpinTimeout(): void {
    if (this.unpinTimeout) {
      clearTimeout(this.unpinTimeout);
      this.unpinTimeout = null;
    }
  }

  reset(): void {
    this.log.debug(this.log.pending('resetting link creation'));

    this.clearUnpinTimeout();

    this.engine.highlight.reset();
    this.components.newLink?.unpin();
    this.engine.removeClass(CANVAS_CREATING_LINK_CLASSNAME);

    const { sourcePortID } = this;

    this.sourcePortID = null;
    this.isCompleting = false;
    this.activeTargetPortID = null;
    this.sourceNodeIsStart = false;
    this.sourceNodeIsAction = false;
    this.targetNodeIsCombined = false;

    if (sourcePortID) {
      this.engine.port.redraw(sourcePortID);
    }

    this.log.debug(this.log.reset('reset link creation'));
  }
}

export default LinkCreationEngine;
