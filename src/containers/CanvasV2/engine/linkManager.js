/* eslint-disable no-underscore-dangle */
import cuid from 'cuid';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';

import { EngineConsumer } from './utils';

class LinkManager extends EngineConsumer {
  internal = {
    add: (sourcePortID, targetPortID, linkID) => {
      const sourcePort = this.engine.getPortByID(sourcePortID);
      const targetPort = this.engine.getPortByID(targetPortID);

      if (!sourcePort || !targetPort || sourcePort.nodeID === targetPort.nodeID) return;

      this.dispatch(Creator.addLink(sourcePortID, targetPortID, linkID));

      const link = this.engine.getLinkByID(linkID);
      this.redrawPorts(link);
    },

    remove: (linkID) => {
      const link = this.engine.getLinkByID(linkID);

      this.dispatch(Creator.removeLink(linkID));
      this.redrawPorts(link);
    },
  };

  api(linkID) {
    return this.engine.links.get(linkID).api;
  }

  add(sourcePortID, targetPortID) {
    const linkID = cuid();

    this.internal.add(sourcePortID, targetPortID, linkID);
    this.dispatch(Realtime.addLink(sourcePortID, targetPortID, linkID));
  }

  remove(linkID) {
    this.internal.remove(linkID);
    this.dispatch(Realtime.removeLink(linkID));
  }

  redraw(linkID) {
    this.api(linkID).redraw();
  }

  redrawPorts({ source: { portID: sourcePortID }, target: { portID: targetPortID } }) {
    if (this.engine.getPortByID(sourcePortID)) {
      this.engine.port.redraw(sourcePortID);
    }

    if (this.engine.getPortByID(targetPortID)) {
      this.engine.port.redraw(targetPortID);
    }
  }

  translatePoint(linkID, movement, isSource) {
    this.api(linkID).translatePoint(movement, isSource);
  }
}

export default LinkManager;
