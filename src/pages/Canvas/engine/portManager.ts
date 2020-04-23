import cuid from 'cuid';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { PartialModel, Port } from '@/models';
import { noop } from '@/utils/functional';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  internal = {
    add: (nodeID: string, port: PartialModel<Port>) => {
      this.dispatch(Creator.addPort(nodeID, port));
    },

    remove: async (portID: string, syncRemove: () => Promise<void> | void = noop) => {
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

  hasActiveLinks(portID: string) {
    const platform = this.select(Skill.activePlatformSelector);
    const links = this.select(Creator.allLinksByIDsSelector)(this.engine.getLinkIDsByPortID(portID));

    return links.some((link) => {
      const port = this.engine.getPortByID(link.source.portID);

      return !port.platform || port.platform === platform;
    });
  }

  async add(nodeID: string, port: PartialModel<Port>) {
    const portID = cuid();
    const augmentedPort = { ...port, id: portID };

    await this.engine.realtime.sendUpdate(Realtime.addPort(nodeID, augmentedPort));
    this.internal.add(nodeID, augmentedPort);
    this.engine.saveHistory();
  }

  async reorder(nodeID: string, from: number, to: number) {
    await this.engine.realtime.sendUpdate(Realtime.reorderPorts(nodeID, from, to));

    this.internal.reorder(nodeID, from, to);
    this.engine.saveHistory();
  }

  async remove(portID: string) {
    await this.internal.remove(portID, () => this.engine.realtime.sendUpdate(Realtime.removePort(portID)));
    this.engine.saveHistory();
  }

  redraw(portID: string) {
    this.engine.dispatcher.redrawPort(portID);
  }

  redrawLinks(portID: string) {
    this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.redraw(linkID));
  }

  getRect(portID: string) {
    return this.api(portID)!.getRect();
  }
}

export default PortManager;
