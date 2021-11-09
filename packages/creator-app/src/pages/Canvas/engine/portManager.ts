import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Creator from '@/ducks/creator';
import * as RealtimeDuck from '@/ducks/realtime';
import { PartialModel } from '@/models';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  log = this.engine.log.child('port');

  internal = {
    add: (nodeID: string, port: PartialModel<Realtime.Port>) => {
      this.dispatch(Creator.addPort(nodeID, port));
    },

    remove: async (portID: string, syncRemove: () => Promise<void> | void = Utils.functional.noop) => {
      const port = this.engine.getPortByID(portID);

      await Promise.all(this.engine.getLinkIDsByPortID(portID).map((linkID) => this.engine.link.remove(linkID)));
      await syncRemove();
      this.dispatch(Creator.removePort(portID));
      this.engine.node.redrawLinks(port.nodeID);
    },

    reorder: async (nodeID: string, from: number, to: number) => {
      this.dispatch(Creator.reorderPort(nodeID, from, to));
      this.engine.node.redrawLinks(nodeID);
    },
  };

  api(portID: string) {
    return this.engine.ports.get(portID)?.api;
  }

  getRect(portID: string) {
    return this.api(portID)?.instance?.getRect();
  }

  async add(nodeID: string, port: Partial<Realtime.Port>) {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding port'), this.log.slug(portID));
    await this.engine.realtime.sendUpdate(RealtimeDuck.addPort(nodeID, augmentedPort));
    this.internal.add(nodeID, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added port'), this.log.slug(portID));
  }

  async reorder(nodeID: string, from: number, to: number) {
    this.log.debug(this.log.pending('reordering ports'), this.log.slug(nodeID), this.log.diff(from, to));
    await this.engine.realtime.sendUpdate(RealtimeDuck.reorderPorts(nodeID, from, to));

    this.internal.reorder(nodeID, from, to);
    this.engine.saveHistory();

    this.log.info(this.log.success('reordered ports'), this.log.slug(nodeID), this.log.diff(from, to));
  }

  async remove(portID: string) {
    this.log.debug(this.log.pending('removing port'), this.log.slug(portID));
    await this.internal.remove(portID, () => this.engine.realtime.sendUpdate(RealtimeDuck.removePort(portID)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed port'), this.log.slug(portID));
  }

  redraw(portID: string) {
    this.engine.dispatcher.redrawPort(portID);
  }

  redrawLinks(portID: string) {
    this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.redraw(linkID));
  }
}

export default PortManager;
