import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { RefObject } from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { buildPath, getMarkerAttrs, getPathPoints, LinkedRects } from '@/pages/Canvas/components/Link';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { isChipNode } from '@/utils/node';

import { CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME, CANVAS_CREATING_LINK_CLASSNAME } from '../constants';
import { EngineConsumer, toCanvasRect } from './utils';

class LinkCreationEngine extends EngineConsumer<{ newLink: NewLinkAPI }> {
  log = this.engine.log.child('link-creation');

  linkEl: RefObject<SVGElement> | null = null;

  markerEl: RefObject<SVGMarkerElement> | null = null;

  isCompleting = false;

  unpinTimeout: NodeJS.Timeout | null = null;

  sourcePortID: string | null = null;

  mousePositionRect = new DOMRect(0, 0, 0, 0);

  sourceNodeIsChip = false;

  sourceNodeIsStart = false;

  sourceNodeIsAction = false;

  activeTargetPortID: string | null = null;

  targetNodeIsCombined = false;

  blockViaLinkMode = false;

  blockViaLinkMenuOpened = false;

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

  redrawNewLink(linkedRects?: LinkedRects | null, options?: { isConnected?: boolean; skipPortSync?: boolean }): void {
    if (!this.markerEl?.current || !this.linkEl?.current || !this.engine.linkCreation.sourcePortID) return;

    let localLinkedRects = linkedRects;

    if (!localLinkedRects) {
      localLinkedRects = this.getLinkedRects(this.getMousePositionRect(), { relative: true, targetIsCanvasRect: true });
      if (!localLinkedRects) return;
    }

    const markerNode = this.markerEl.current;
    const isStraight = this.engine.isStraightLinks();

    const pathPoints = getPathPoints(localLinkedRects, {
      isStraight,
      isConnected: options?.isConnected ?? false,
      sourceNodeIsChip: this.sourceNodeIsChip,
      sourceNodeIsStart: this.sourceNodeIsStart,
      sourceNodeIsAction: this.sourceNodeIsAction,
      targetNodeIsCombined: options?.isConnected ? this.targetNodeIsCombined : false,
      sourceParentNodeRect: this.getSourceParentNodeRect(),
    });

    const path = buildPath(pathPoints, { isStraight });
    const markerAttrs = getMarkerAttrs(pathPoints, { isStraight });

    this.linkEl.current.setAttribute('d', path);

    Utils.object.getKeys(markerAttrs).forEach((attr) => markerNode.setAttribute(attr, markerAttrs[attr]));

    if (!options?.skipPortSync) {
      this.engine.portLinkInstances
        .get(this.engine.linkCreation.sourcePortID)
        ?.api.updatePosition(pathPoints, () => this.redrawNewLink(null, { skipPortSync: true }));
    }
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
      const sourceNodeParent = this.engine.getNodeByID(sourceNode?.parentNode);

      this.sourceNodeIsChip = isChipNode(sourceNode, sourceNodeParent);
      this.sourceNodeIsStart = sourceNode?.type === BlockType.START;
      this.sourceNodeIsAction = sourceNodeParent?.type === BlockType.ACTIONS;
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

    this.engine.removeClass(CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME);

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
    if (this.isCompleting || this.blockViaLinkMenuOpened) return;

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
    const sourceNodeRect = this.getSourceNodeRect(port.nodeID);

    if (!sourcePortRect || !sourceNodeRect) return null;

    return {
      sourceNodeRect,
      sourcePortRect: toCanvasRect(this.engine.canvas, sourcePortRect),
      targetPortRect: targetIsCanvasRect ? targetRect : toCanvasRect(this.engine.canvas, targetRect, { relative }),
      targetNodeRect: targetIsCanvasRect ? targetRect : toCanvasRect(this.engine.canvas, targetRect, { relative }),
    };
  }

  getSourceNodeRect(nodeID: string): DOMRect | null {
    if (!this.engine.canvas) return null;

    let sourceNodeRect: DOMRect | null = null;

    if (!this.sourceNodeIsAction) {
      sourceNodeRect = this.engine.node.getRect(nodeID);
    } else {
      const node = this.engine.getNodeByID(nodeID);

      if (!node?.parentNode) return null;

      const actionsNodePorts = this.select(CreatorV2.portsByNodeIDSelector, { id: node.parentNode });

      const actionsNodeInLinkID = this.engine.getLinkIDsByPortID(actionsNodePorts?.in[0])[0];

      const actionsSourceNodeLink = this.engine.getLinkByID(actionsNodeInLinkID);

      if (!actionsSourceNodeLink) return null;

      sourceNodeRect = this.engine.node.getRect(actionsSourceNodeLink.source.nodeID);
    }

    if (!sourceNodeRect) return null;

    return toCanvasRect(this.engine.canvas, sourceNodeRect);
  }

  getSourceParentNodeRect(): DOMRect | null {
    if (!this.sourcePortID || !this.engine.canvas) return null;

    const port = this.engine.getPortByID(this.sourcePortID);

    if (!port) return null;

    const node = this.engine.getNodeByID(port.nodeID);

    if (!node?.parentNode) return null;

    let sourceParentNodeRect: DOMRect | null = null;

    if (this.sourceNodeIsAction) {
      const actionsNodePorts = this.select(CreatorV2.portsByNodeIDSelector, { id: node.parentNode });

      const actionsNodeInLinkID = this.engine.getLinkIDsByPortID(actionsNodePorts?.in[0])[0];

      const actionsSourceNode = this.engine.getSourceNodeByLinkID(actionsNodeInLinkID);

      if (!actionsSourceNode?.parentNode) return null;

      sourceParentNodeRect = this.engine.node.getRect(actionsSourceNode.parentNode);
    } else {
      sourceParentNodeRect = this.engine.node.getRect(node.parentNode);
    }

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
    this.engine.removeClass(CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME);

    const { sourcePortID } = this;

    this.sourcePortID = null;
    this.isCompleting = false;
    this.sourceNodeIsChip = false;
    this.sourceNodeIsStart = false;
    this.activeTargetPortID = null;
    this.sourceNodeIsAction = false;
    this.targetNodeIsCombined = false;
    this.blockViaLinkMode = false;
    this.blockViaLinkMenuOpened = false;

    if (sourcePortID) {
      const sourcePort = this.engine.select(CreatorV2.portByIDSelector, { id: sourcePortID });
      const sourceNode = this.engine.getNodeByID(sourcePort?.nodeID);
      const sourceParentNode = this.engine.getNodeByID(sourceNode?.parentNode);

      this.engine.port.redraw(sourcePortID);

      if (sourceParentNode && Realtime.Utils.typeGuards.isActionsBlockType(sourceParentNode.type)) {
        this.engine.node.redraw(sourceParentNode.id);
      }
    }

    this.log.debug(this.log.reset('reset link creation'));
  }

  enableBlockViaLinkMode = () => {
    this.blockViaLinkMode = true;
    this.engine.addClass(CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME);
  };

  blockViaLinkMenuShown = () => {
    this.blockViaLinkMenuOpened = true;
    this.engine.removeClass(CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME);
  };

  blockViaLinkMenuHidden = () => {
    if (this.blockViaLinkMode) this.engine.addClass(CANVAS_CREATING_LINK_BLOCK_VIA_LINK_MODE_CLASSNAME);

    this.blockViaLinkMenuOpened = false;
    this.components.newLink?.hideMenu();
  };
}

export default LinkCreationEngine;
