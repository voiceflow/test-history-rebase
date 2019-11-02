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
    },

    remove: (linkID) => this.dispatch(Creator.removeLink(linkID)),
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

  translatePoint(linkID, movement, isSource) {
    this.api(linkID).translatePoint(movement, isSource);
  }

  redraw(linkID) {
    this.engine.dispatcher.redrawLink(linkID);
  }

  redrawPorts({ source: { portID: sourcePortID }, target: { portID: targetPortID } }) {
    this.engine.port.redraw(sourcePortID);
    this.engine.port.redraw(targetPortID);
  }
}

export default LinkManager;
