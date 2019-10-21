import cuid from 'cuid';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  internal = {
    add: (nodeID, portID, port) => {
      this.dispatch(Creator.addPort(nodeID, portID, port));
      this.engine.node.redraw(nodeID);
    },

    remove: (portID) => {
      const port = this.engine.getPortByID(portID);

      this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.remove(linkID));
      this.dispatch(Creator.removePort(portID));
      this.engine.node.redraw(port.nodeID);
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

      return !port.plaform || port.plaform === platform;
    });
  }

  add(nodeID, port) {
    const portID = cuid();

    this.internal.add(nodeID, portID, port);
    this.dispatch(Realtime.addPort(nodeID, portID, port));
  }

  remove(portID) {
    this.internal.remove(portID);
    this.dispatch(Realtime.removePort(portID));
  }

  redrawLinks(portID) {
    if (!this.engine.ports.has(portID)) {
      return;
    }

    this.engine
      .getLinkIDsByPortID(portID)
      .filter((linkID) => this.engine.links.has(linkID))
      .forEach((linkID) => this.engine.link.redraw(linkID));
  }

  redraw(portID) {
    if (this.engine.ports.has(portID)) {
      this.api(portID).redraw();
    }
  }

  getRect(portID) {
    return this.api(portID).getRect();
  }
}

export default PortManager;
