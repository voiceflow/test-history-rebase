import { PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import { Link } from '@/models';
import { Pair } from '@/types';
import { objectID } from '@/utils';

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

  isVisible(linkID: string, platform: PlatformType) {
    const link = this.engine.getLinkByID(linkID);
    const sourcePort = this.engine.getPortByID(link.source.portID);

    return !sourcePort.platform || sourcePort.platform === platform;
  }

  getPoints(linkID: string) {
    const link = this.engine.getLinkByID(linkID);
    const getPortRect = (relationship: 'source' | 'target') => this.engine.port.getRect(link[relationship].portID);

    return extractPoints(this.engine.canvas!, getPortRect('source'), getPortRect('target'));
  }

  async add(sourcePortID: string, targetPortID: string) {
    const linkID = objectID();

    this.log.debug(this.log.pending('adding link'), this.log.slug(linkID));
    await this.engine.realtime.sendUpdate(Realtime.addLink(sourcePortID, targetPortID, linkID));
    this.internal.add(sourcePortID, targetPortID, linkID);
    this.engine.saveHistory();

    this.log.info(this.log.success('added link'), this.log.slug(linkID));
  }

  async remove(linkID: string) {
    this.log.debug(this.log.pending('removed link'), this.log.slug(linkID));
    await this.engine.realtime.sendUpdate(Realtime.removeLink(linkID));
    this.internal.remove(linkID);
    this.engine.saveHistory();

    this.log.info(this.log.success('removed link'), this.log.slug(linkID));
  }

  translatePoint(linkID: string, movement: Pair<number>, isSource: boolean) {
    this.api(linkID)?.instance?.translatePoint(movement, isSource);

    this.log.debug(`translated ${isSource ? 'source' : 'target'} point`, this.log.value(linkID));
  }

  redraw(linkID: string) {
    this.engine.dispatcher.redrawLink(linkID);
  }

  redrawLinked(linkID: string) {
    const link = this.engine.getLinkByID(linkID);

    this.redraw(linkID);
    this.engine.port.redraw(link.source.portID);
    this.engine.node.redraw(link.target.nodeID);
  }

  redrawPorts({ source: { portID: sourcePortID }, target: { portID: targetPortID } }: Link) {
    this.engine.port.redraw(sourcePortID);
    this.engine.port.redraw(targetPortID);
  }
}

export default LinkManager;
