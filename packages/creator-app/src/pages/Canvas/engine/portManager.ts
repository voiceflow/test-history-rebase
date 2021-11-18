import { Models } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as RealtimeSDK from '@voiceflow/realtime-sdk';

import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import { PartialModel } from '@/models';
import PortEntity from '@/pages/Canvas/engine/entities/portEntity';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  log = this.engine.log.child('port');

  internal = {
    addOutDynamic: (nodeID: string, port: PartialModel<RealtimeSDK.Port>): void => {
      this.dispatch(Creator.addOutDynamicPort(nodeID, port));
    },

    addOutBuiltIn: (nodeID: string, portType: Models.PortType, port: PartialModel<RealtimeSDK.Port>): void => {
      this.dispatch(Creator.addOutBuiltInPort(nodeID, portType, port));
    },

    removeOutDynamic: async (portID: string, syncRemove?: () => Promise<void> | void): Promise<void> => {
      const port = this.engine.getPortByID(portID);

      await Promise.all(this.engine.getLinkIDsByPortID(portID).map((linkID) => this.engine.link.remove(linkID)));
      await syncRemove?.();

      this.dispatch(Creator.removeOutDynamicPort(portID));
      this.engine.node.redrawLinks(port.nodeID);
    },

    removeOutBuiltIn: async (portType: Models.PortType, portID: string, syncRemove?: () => Promise<void> | void): Promise<void> => {
      const port = this.engine.getPortByID(portID);

      await Promise.all(this.engine.getLinkIDsByPortID(portID).map((linkID) => this.engine.link.remove(linkID)));
      await syncRemove?.();

      this.dispatch(Creator.removeOutBuiltInPort(portType, portID));
      this.engine.node.redrawLinks(port.nodeID);
    },

    reorderOutDynamic: (nodeID: string, from: number, to: number): void => {
      this.dispatch(Creator.reorderOutDynamicPort(nodeID, from, to));
      this.engine.node.redrawLinks(nodeID);
    },
  };

  api(portID: string): PortEntity | undefined {
    return this.engine.ports.get(portID)?.api;
  }

  getRect(portID: string): DOMRect | null {
    return this.api(portID)?.instance?.getRect() ?? null;
  }

  async addOutDynamic(nodeID: string, port?: Partial<RealtimeSDK.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding out dynamic port'), this.log.slug(portID));
    await this.engine.realtime.sendUpdate(Realtime.addOutDynamicPort(nodeID, augmentedPort));
    this.internal.addOutDynamic(nodeID, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added out dynamic port'), this.log.slug(portID));
  }

  async addOutBuiltIn(nodeID: string, portType: Models.PortType, port?: Partial<RealtimeSDK.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID, label: portType };

    this.log.debug(this.log.pending('adding out builtin port'), this.log.slug(portID));
    await this.engine.realtime.sendUpdate(Realtime.addOutBuiltInPort(nodeID, portType, augmentedPort));
    this.internal.addOutBuiltIn(nodeID, portType, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added out builtin port'), this.log.slug(portID));
  }

  async reorderOutDynamic(nodeID: string, from: number, to: number): Promise<void> {
    this.log.debug(this.log.pending('reordering out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));
    await this.engine.realtime.sendUpdate(Realtime.reorderOutDynamicPorts(nodeID, from, to));

    this.internal.reorderOutDynamic(nodeID, from, to);
    this.engine.saveHistory();

    this.log.info(this.log.success('reordered out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));
  }

  async removeOutDynamic(portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out dynamic port'), this.log.slug(portID));
    await this.internal.removeOutDynamic(portID, () => this.engine.realtime.sendUpdate(Realtime.removeOutDynamicPort(portID)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed out dynamic port'), this.log.slug(portID));
  }

  async removeOutBuiltIn(portType: Models.PortType, portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out builtin port'), this.log.slug(portID));
    await this.internal.removeOutBuiltIn(portType, portID, () => this.engine.realtime.sendUpdate(Realtime.removeOutBuiltInPort(portType, portID)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed out builtin port'), this.log.slug(portID));
  }

  redraw(portID: string): void {
    this.engine.dispatcher.redrawPort(portID);
  }

  redrawLinks(portID: string): void {
    this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.redraw(linkID));
  }
}

export default PortManager;
