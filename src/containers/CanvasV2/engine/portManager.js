import cuid from 'cuid';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  internal = {
    add: (nodeID, portID, port) => {
      this.dispatch(Creator.addPort(nodeID, portID, port));
    },

    remove: (portID) => {
      this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.remove(linkID));
      this.dispatch(Creator.removePort(portID));
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

  add(nodeID, port) {
    const portID = cuid();

    this.internal.add(nodeID, portID, port);
    this.dispatch(Realtime.addPort(nodeID, portID, port));
    this.engine.saveHistory();
  }

  remove(portID) {
    this.internal.remove(portID);
    this.dispatch(Realtime.removePort(portID));
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
