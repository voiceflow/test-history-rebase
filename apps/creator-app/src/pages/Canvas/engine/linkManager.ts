import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';
import type { LinkedRects } from '@/pages/Canvas/components/Link';
import type { TranslatePointData } from '@/pages/Canvas/engine/entities/linkEntity';
import type LinkEntity from '@/pages/Canvas/engine/entities/linkEntity';
import type { Pair } from '@/types';

import { EngineConsumer, extractPoints, toCanvasRect } from './utils';

const addAction = ({
  portType,
  portKey,
  payload,
}: {
  portType: BaseModels.PortType | null;
  portKey: string | null;
  payload: Realtime.link.AddBuiltinPayload | Realtime.link.AddByKeyPayload | Realtime.link.AddDynamicPayload;
}) => {
  if (portType) return Realtime.link.addBuiltin({ ...payload, type: portType });
  if (portKey) return Realtime.link.addByKey({ ...payload, key: portKey });
  return Realtime.link.addDynamic(payload);
};

class LinkManager extends EngineConsumer {
  log = this.engine.log.child('link');

  internal = {
    add: async (sourcePortID: string, targetPortID: string, linkID: string): Promise<void> => {
      const sourcePort = this.engine.getPortByID(sourcePortID);
      const targetPort = this.engine.getPortByID(targetPortID);

      if (!sourcePort || !targetPort || sourcePort.nodeID === targetPort.nodeID) return;

      const portType = this.select(CreatorV2.builtInPortTypeSelector, { id: sourcePortID });
      const portKey = this.select(CreatorV2.byKeyPortKeySelector, { id: sourcePortID });
      const sourceParentNodeID = this.select(CreatorV2.parentNodeIDByStepIDSelector, { id: sourcePort.nodeID });
      const payload = {
        ...this.engine.context,
        sourceParentNodeID,
        sourceNodeID: sourcePort.nodeID,
        sourcePortID,
        targetNodeID: targetPort.nodeID,
        targetPortID,
        linkID,
      };

      await this.dispatch.partialSync(addAction({ payload, portKey, portType }));
    },

    removeMany: async (linkIDs: string[]): Promise<void> => {
      if (linkIDs.some((linkID) => this.engine.highlight.isLinkTarget(linkID))) {
        this.engine.highlight.reset();
      }

      const links = this.select(CreatorV2.linksByIDsSelector, { ids: linkIDs }).map((link) => {
        const portType = this.select(CreatorV2.builtInPortTypeSelector, { id: link.source.portID });
        const portKey = this.select(CreatorV2.byKeyPortKeySelector, { id: link.source.portID });

        return {
          ...link.source,
          linkID: link.id,
          ...(portType ? { type: portType } : {}),
          ...(portKey ? { key: portKey } : {}),
        };
      });

      await this.dispatch.partialSync(Realtime.link.removeMany({ ...this.engine.context, links }));
    },

    patchMany: async (patches: Realtime.link.LinkPatch[]): Promise<void> => {
      const patchesWithType = patches.map((patch) => {
        const portType = this.select(CreatorV2.builtInPortTypeSelector, { id: patch.portID });
        const portKey = this.select(CreatorV2.byKeyPortKeySelector, { id: patch.portID });

        return { ...patch, ...(portType ? { type: portType } : {}), ...(portKey ? { key: portKey } : {}) };
      });

      await this.dispatch.partialSync(Realtime.link.patchMany({ ...this.engine.context, patches: patchesWithType }));
    },
  };

  api(linkID: string): LinkEntity | null {
    return this.engine.links.get(linkID)?.api ?? null;
  }

  isSupported(linkID: string): boolean {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return false;

    const isPortReady = (relationship: 'source' | 'target') =>
      !!this.engine.port.api(link[relationship].portID)?.isReady();

    return isPortReady('source') && isPortReady('target');
  }

  isActive(linkID: string): boolean {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return false;

    return this.engine.node.isBranchActive(link.source.nodeID) || this.engine.node.isBranchActive(link.target.nodeID);
  }

  getSourceTargetPoints(linkID: string): Pair<Realtime.Point> | null {
    const link = this.engine.getLinkByID(linkID);

    if (!link || !this.engine.canvas) return null;

    const getPortRect = (relationship: 'source' | 'target') => this.engine.port.getRect(link[relationship].portID);

    return extractPoints(this.engine.canvas, getPortRect('source'), getPortRect('target'));
  }

  getLinkedRects(linkID: string): LinkedRects | null {
    const link = this.engine.getLinkByID(linkID);

    if (!link || !this.engine.canvas) return null;

    const sourcePortRect = this.engine.port.getRect(link.source.portID);
    const sourceNodeRect = this.getSourceNodeRect(link.source.nodeID);
    const targetPortRect = this.engine.port.getRect(link.target.portID);
    const targetNodeRect = this.engine.node.getRect(link.target.nodeID);

    if (!sourcePortRect || !sourceNodeRect || !targetPortRect || !targetNodeRect) return null;

    return {
      sourceNodeRect,
      sourcePortRect: toCanvasRect(this.engine.canvas, sourcePortRect),
      targetPortRect: toCanvasRect(this.engine.canvas, targetPortRect),
      targetNodeRect: toCanvasRect(this.engine.canvas, targetNodeRect),
    };
  }

  getSourceNodeRect(nodeID: string): DOMRect | null {
    if (!this.engine.canvas) return null;

    const sourceNode = this.engine.getNodeByID(nodeID);
    const sourceParentNode = this.engine.getNodeByID(sourceNode?.parentNode);

    let sourceNodeRect: DOMRect | null = null;

    if (sourceParentNode && Realtime.Utils.typeGuards.isActionsBlockType(sourceParentNode.type)) {
      const node = this.engine.getNodeByID(nodeID);

      if (!node?.parentNode) return null;

      const actionsNodePorts = this.select(CreatorV2.portsByNodeIDSelector, { id: node.parentNode });

      const actionsNodeInLinkID = this.engine.getLinkIDsByPortID(actionsNodePorts?.in[0])[0];

      const actionsSourceNodeLink = this.engine.getLinkByID(actionsNodeInLinkID);

      if (!actionsSourceNodeLink) return null;

      sourceNodeRect = this.engine.node.getRect(actionsSourceNodeLink.source.nodeID);
    } else {
      sourceNodeRect = this.engine.node.getRect(nodeID);
    }

    if (!sourceNodeRect) return null;

    return toCanvasRect(this.engine.canvas, sourceNodeRect);
  }

  getSourceParentNodeRect(linkID: string): DOMRect | null {
    const link = this.engine.getLinkByID(linkID);

    if (!link || !this.engine.canvas) return null;

    const sourceNode = this.engine.getNodeByID(link.source.nodeID);
    const sourceParentNode = this.engine.getNodeByID(sourceNode?.parentNode);

    if (!sourceParentNode) return null;

    let sourceParentNodeRect: DOMRect | null = null;

    if (Realtime.Utils.typeGuards.isActionsBlockType(sourceParentNode.type)) {
      const actionsNodePorts = this.select(CreatorV2.portsByNodeIDSelector, { id: sourceParentNode.id });

      const actionsNodeInLinkID = this.engine.getLinkIDsByPortID(actionsNodePorts?.in[0])[0];

      const actionsSourceNode = this.engine.getSourceNodeByLinkID(actionsNodeInLinkID);

      if (!actionsSourceNode?.parentNode) return null;

      sourceParentNodeRect = this.engine.node.getRect(actionsSourceNode.parentNode);
    } else {
      sourceParentNodeRect = this.engine.node.getRect(sourceParentNode.id);
    }

    if (!sourceParentNodeRect) return null;

    return toCanvasRect(this.engine.canvas, sourceParentNodeRect);
  }

  /**
   * adds a link between two known ports
   */
  async add(sourcePortID: string, targetPortID: string): Promise<void> {
    const linkID = sourcePortID;

    this.log.debug(this.log.pending('adding link'), this.log.slug(linkID));

    await this.internal.add(sourcePortID, targetPortID, linkID);

    this.log.info(this.log.success('added link'), this.log.slug(linkID));
  }

  /**
   * removes multiple links by their IDs
   */
  // TODO: this can be refactored after AA because only a single link will ever be deleted at a time
  async removeMany(linkIDs: string[]): Promise<void> {
    this.log.debug(this.log.pending('removing links'), linkIDs);

    await this.internal.removeMany(linkIDs);

    this.log.info(this.log.success('removed links'), this.log.value(linkIDs.length));
  }

  /**
   * removes a single link by its IDs
   */
  remove(linkID: string): Promise<void> {
    return this.removeMany([linkID]);
  }

  /**
   * patches multiple links
   */
  async patchMany(patches: Omit<Realtime.link.LinkPatch, 'nodeID' | 'portID'>[]): Promise<void> {
    const validPatches = patches
      .map((patch) => {
        const link = this.engine.getLinkByID(patch.linkID);

        if (!link) return null;

        return { ...link.source, ...patch } as Realtime.link.LinkPatch;
      })
      .filter((patch): patch is Realtime.link.LinkPatch => !!patch);

    if (!validPatches.length) {
      this.log.debug('attempted to patch an empty set of links');

      return;
    }

    const linkIDs = validPatches.map((patch) => patch.linkID);

    this.log.debug(this.log.pending('patching links'), linkIDs);
    await this.internal.patchMany(validPatches);

    this.log.info(this.log.success('patched links'), this.log.value(linkIDs.length));
  }

  /**
   * patches a single link by its ID
   */
  patch(linkID: string, data: Partial<Realtime.LinkData>): Promise<void> {
    return this.patchMany([{ linkID, data }]);
  }

  async savePointsMany(linkIDs: string[]): Promise<void> {
    const patches = linkIDs
      .map((linkID) => ({ linkID, data: { points: this.api(linkID)?.instance?.getPoints().current ?? null } }))
      .filter(({ data }) => data.points);

    await this.patchMany(patches);
  }

  translatePoint(linkID: string, movement: Pair<number>, data: TranslatePointData): void {
    this.api(linkID)?.instance?.translatePoint(movement, data);

    this.log.debug(`translated ${data.isSource ? 'source' : 'target'} point`, this.log.value(linkID));
  }

  redraw(linkID: string): void {
    if (!this.engine.canvas?.isAnimating()) {
      this.engine.dispatcher.redrawLink(linkID);
    }
  }

  redrawLinked(linkID: string): void {
    const link = this.engine.getLinkByID(linkID);

    this.redraw(linkID);

    if (link) {
      this.redrawPorts(link);
      this.engine.node.redraw(link.target.nodeID);
    }
  }

  redrawPorts({ id, source: { portID: sourcePortID }, target: { portID: targetPortID } }: Realtime.Link): void {
    const sourceNode = this.engine.getSourceNodeByLinkID(id);
    const sourceParentNode = this.engine.getNodeByID(sourceNode?.parentNode);

    if (sourceParentNode && Realtime.Utils.typeGuards.isActionsBlockType(sourceParentNode.type)) {
      this.engine.node.redraw(sourceParentNode.id);
    }

    this.engine.port.redraw(sourcePortID);
    this.engine.port.redraw(targetPortID);
  }
}

export default LinkManager;
