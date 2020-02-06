import cuid from 'cuid';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { identity } from '@/utils/functional';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  internal = {
    add: (nodeID, portID, port) => {
      this.dispatch(Creator.addPort(nodeID, portID, port));
    },

    remove: async (portID, syncRemove = identity) => {
      const port = this.engine.getPortByID(portID);

      await Promise.all(this.engine.getLinkIDsByPortID(portID).map((linkID) => this.engine.link.remove(linkID)));
      await syncRemove();
      this.dispatch(Creator.removePort(portID));
      this.engine.node.redrawLinks(port.nodeID);
    },

    reorder: async (nodeID, from, to) => {
      this.dispatch(Creator.reorderPort(nodeID, from, to));
      this.engine.node.redrawLinks(nodeID);
    },
  };

  api(portID) {
    return this.engine.ports.get(portID).api;
  }

  hasActiveLinks(portID) {
    const platform = this.select(Skill.activePlatformSelector);
    const links = this.select(Creator.allLinksByIDsSelector)(this.engine.getLinkIDsByPortID(portID));

    return links.some((link) => {
      const port = this.engine.getPortByID(link.source.portID);

      return !port.platform || port.platform === platform;
    });
  }

  async add(nodeID, port) {
    const portID = cuid();

    await this.engine.realtime.sendUpdate(Realtime.addPort(nodeID, portID, port));
    this.internal.add(nodeID, portID, port);
    this.engine.saveHistory();
  }

  async reorder(nodeID, from, to) {
    await this.engine.realtime.sendUpdate(Realtime.reorderPorts(nodeID, from, to));

    this.internal.reorder(nodeID, from, to);
    this.engine.saveHistory();
  }

  async remove(portID) {
    await this.internal.remove(portID, () => this.engine.realtime.sendUpdate(Realtime.removePort(portID)));
    this.engine.saveHistory();
  }

  redraw(portID) {
    this.engine.dispatcher.redrawPort(portID);
  }

  redrawLinks(portID) {
    this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.redraw(linkID));
  }

  getRect(portID) {
    return this.api(portID).getRect();
  }
}

export default PortManager;
