import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Creator from '@/ducks/creator';
import * as RealtimeDuck from '@/ducks/realtime';
import { Pair } from '@/types';

import { EngineConsumer, extractPoints } from './utils';

class LinkManager extends EngineConsumer {
  log = this.engine.log.child('link');

  internal = {
    add: (sourcePortID: string, targetPortID: string, linkID: string) => {
      const sourcePort = this.engine.getPortByID(sourcePortID);
      const targetPort = this.engine.getPortByID(targetPortID);

      if (!sourcePort || !targetPort || sourcePort.nodeID === targetPort.nodeID) return;

      this.dispatch(Creator.addLink(sourcePortID, targetPortID, linkID));
    },

    remove: (linkID: string) => {
      if (this.engine.highlight.isLinkTarget(linkID)) {
        this.engine.highlight.reset();
      }

      this.dispatch(Creator.removeLink(linkID));
    },

    updateData: (linkID: string, data: Partial<Realtime.LinkData>) => {
      this.dispatch(Creator.updateLinkData(linkID, data));
    },

    updateDataMany: (payload: { linkID: string; data: Partial<Realtime.LinkData> }[]) => {
      this.dispatch(Creator.updateLinkDataMany(payload));
    },
  };

  api(linkID: string) {
    return this.engine.links.get(linkID)?.api;
  }

  isSupported(linkID: string) {
    const link = this.engine.getLinkByID(linkID);
    const isPortReady = (relationship: 'source' | 'target') => !!this.engine.port.api(link[relationship].portID)?.isReady();

    return isPortReady('source') && isPortReady('target');
  }

  isActive(linkID: string) {
    const link = this.engine.getLinkByID(linkID);

    return this.engine.node.isBranchActive(link.source.nodeID) || this.engine.node.isBranchActive(link.target.nodeID);
  }

  isVisible(linkID: string, platform: Constants.PlatformType) {
    const link = this.engine.getLinkByID(linkID);
    const sourcePort = this.engine.getPortByID(link.source.portID);

    return !sourcePort.platform || sourcePort.platform === platform;
  }

  getSourceTargetPoints(linkID: string) {
    const link = this.engine.getLinkByID(linkID);
    const getPortRect = (relationship: 'source' | 'target') => this.engine.port.getRect(link[relationship].portID);

    return extractPoints(this.engine.canvas!, getPortRect('source'), getPortRect('target'));
  }

  async add(sourcePortID: string, targetPortID: string) {
    const linkID = sourcePortID;

    this.log.debug(this.log.pending('adding link'), this.log.slug(linkID));
    await this.engine.realtime.sendUpdate(RealtimeDuck.addLink(sourcePortID, targetPortID, linkID));
    this.internal.add(sourcePortID, targetPortID, linkID);
    this.engine.saveHistory();

    this.log.info(this.log.success('added link'), this.log.slug(linkID));
  }

  async remove(linkID: string) {
    this.log.debug(this.log.pending('removed link'), this.log.slug(linkID));
    await this.engine.realtime.sendUpdate(RealtimeDuck.removeLink(linkID));
    this.internal.remove(linkID);
    this.engine.saveHistory();

    this.log.info(this.log.success('removed link'), this.log.slug(linkID));
  }

  async updateLinkData(linkID: string, data: Partial<Realtime.LinkData>) {
    this.log.debug(this.log.pending('updated data'), this.log.slug(linkID));
    this.internal.updateData(linkID, data);
    await this.engine.realtime.sendUpdate(RealtimeDuck.updateLinkData(linkID, data));
    this.engine.saveHistory();

    this.log.info(this.log.success('updated data'), this.log.slug(linkID));
  }

  async updateLinkDataMany(payload: { linkID: string; data: Partial<Realtime.LinkData> }[]) {
    this.internal.updateDataMany(payload);
    await this.engine.realtime.sendUpdate(RealtimeDuck.updateLinkDataMany(payload));
  }

  async savePointsMany(linkIDs: string[]) {
    const payload = linkIDs
      .map((linkID) => ({ linkID, data: { points: this.api(linkID)?.instance?.getPoints().current ?? null } }))
      .filter(({ data }) => data.points);

    await this.updateLinkDataMany(payload);
  }

  translatePoint(linkID: string, movement: Pair<number>, data: { isSource: boolean; reposition: boolean; sourceAndTargetSelected: boolean }) {
    this.api(linkID)?.instance?.translatePoint(movement, data);

    this.log.debug(`translated ${data.isSource ? 'source' : 'target'} point`, this.log.value(linkID));
  }

  redraw(linkID: string) {
    if (!this.engine.canvas?.isAnimating()) {
      this.engine.dispatcher.redrawLink(linkID);
    }
  }

  redrawLinked(linkID: string) {
    const link = this.engine.getLinkByID(linkID);

    this.redraw(linkID);

    if (link) {
      this.redrawPorts(link);
      this.engine.node.redraw(link.target.nodeID);
    }
  }

  redrawPorts({ source: { portID: sourcePortID }, target: { portID: targetPortID } }: Realtime.Link) {
    this.engine.port.redraw(sourcePortID);
    this.engine.port.redraw(targetPortID);
  }
}

export default LinkManager;
