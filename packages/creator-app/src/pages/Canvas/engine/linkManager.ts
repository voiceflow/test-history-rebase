import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as RealtimeDuck from '@/ducks/realtime';
import LinkEntity from '@/pages/Canvas/engine/entities/linkEntity';
import { Pair } from '@/types';

import { EngineConsumer, extractPoints } from './utils';

class LinkManager extends EngineConsumer {
  log = this.engine.log.child('link');

  internal = {
    add: async (sourcePortID: string, targetPortID: string, linkID: string): Promise<void> => {
      const sourcePort = this.engine.getPortByID(sourcePortID);
      const targetPort = this.engine.getPortByID(targetPortID);

      if (!sourcePort || !targetPort || sourcePort.nodeID === targetPort.nodeID) return;

      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.link.add({
            ...this.engine.context,
            sourceNodeID: sourcePort.nodeID,
            sourcePortID,
            targetNodeID: targetPort.nodeID,
            targetPortID,
            linkID,
          })
        );
      } else {
        this.dispatch(Creator.addLink(sourcePortID, targetPortID, linkID));
      }
    },

    removeMany: async (linkIDs: string[]): Promise<void> => {
      if (linkIDs.some((linkID) => this.engine.highlight.isLinkTarget(linkID))) {
        this.engine.highlight.reset();
      }

      if (this.isAtomicActionsPhase2) {
        const links = this.select(CreatorV2.linksByIDsSelector, { ids: linkIDs }).map((link) => ({ ...link.source, linkID: link.id }));

        await this.dispatch.sync(Realtime.link.removeMany({ ...this.engine.context, links }));
      } else {
        this.dispatch(Creator.removeManyLinks(linkIDs));
      }
    },

    patchMany: async (patches: Realtime.link.LinkPatch[]): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(Realtime.link.patchMany({ ...this.engine.context, patches }));
      } else {
        this.dispatch(Creator.updateLinkDataMany(patches));
      }
    },
  };

  api(linkID: string): LinkEntity | null {
    return this.engine.links.get(linkID)?.api ?? null;
  }

  isSupported(linkID: string): boolean {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return false;

    const isPortReady = (relationship: 'source' | 'target') => !!this.engine.port.api(link[relationship].portID)?.isReady();

    return isPortReady('source') && isPortReady('target');
  }

  isActive(linkID: string): boolean {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return false;

    return this.engine.node.isBranchActive(link.source.nodeID) || this.engine.node.isBranchActive(link.target.nodeID);
  }

  isVisible(linkID: string, platform: VoiceflowConstants.PlatformType): boolean {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return false;

    const sourcePort = this.engine.getPortByID(link.source.portID);
    if (!sourcePort) return false;

    return !sourcePort.platform || sourcePort.platform === platform;
  }

  getSourceTargetPoints(linkID: string): Pair<Realtime.Point> | null {
    const link = this.engine.getLinkByID(linkID);
    if (!link) return null;

    const getPortRect = (relationship: 'source' | 'target') => this.engine.port.getRect(link[relationship].portID);

    return extractPoints(this.engine.canvas!, getPortRect('source'), getPortRect('target'));
  }

  /**
   * adds a link between two known ports
   */
  async add(sourcePortID: string, targetPortID: string): Promise<void> {
    const linkID = sourcePortID;

    this.log.debug(this.log.pending('adding link'), this.log.slug(linkID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addLink(sourcePortID, targetPortID, linkID));
    }

    await this.internal.add(sourcePortID, targetPortID, linkID);
    this.engine.saveHistory();

    this.log.info(this.log.success('added link'), this.log.slug(linkID));
  }

  /**
   * removes multiple links by their IDs
   */
  async removeMany(linkIDs: string[]): Promise<void> {
    this.log.debug(this.log.pending('removing links'), linkIDs);

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.removeManyLinks(linkIDs));
    }

    await this.internal.removeMany(linkIDs);
    this.engine.saveHistory();

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
  async patchMany(
    patches: Omit<Realtime.link.LinkPatch, 'nodeID' | 'portID'>[],
    { saveHistory = true }: { saveHistory?: boolean } = {}
  ): Promise<void> {
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

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.updateLinkDataMany(validPatches));
    }

    if (saveHistory) {
      this.engine.saveHistory();
    }

    this.log.info(this.log.success('patched links'), this.log.value(linkIDs.length));
  }

  /**
   * patches a single link by its ID
   */
  patch(linkID: string, data: Partial<Realtime.LinkData>): Promise<void> {
    return this.patchMany([{ linkID, data }]);
  }

  async savePointsMany(linkIDs: string[], options?: { saveHistory?: boolean }): Promise<void> {
    const patches = linkIDs
      .map((linkID) => ({ linkID, data: { points: this.api(linkID)?.instance?.getPoints().current ?? null } }))
      .filter(({ data }) => data.points);

    await this.patchMany(patches, options);
  }

  translatePoint(linkID: string, movement: Pair<number>, data: { isSource: boolean; reposition: boolean; sourceAndTargetSelected: boolean }): void {
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

  redrawPorts({ source: { portID: sourcePortID }, target: { portID: targetPortID } }: Realtime.Link): void {
    this.engine.port.redraw(sourcePortID);
    this.engine.port.redraw(targetPortID);
  }
}

export default LinkManager;
