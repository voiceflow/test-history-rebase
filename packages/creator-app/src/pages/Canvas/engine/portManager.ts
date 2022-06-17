import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as RealtimeDuck from '@/ducks/realtime';
import PortEntity from '@/pages/Canvas/engine/entities/portEntity';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  log = this.engine.log.child('port');

  internal = {
    addByKey: async (nodeID: string, key: string, port: Realtime.PartialModel<Realtime.Port>): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.port.addByKey({
            ...this.engine.context,
            nodeID,
            portID: port.id,
            label: port.label,
            key,
          })
        );
      } else {
        this.dispatch(Creator.addOutByKeyPort(nodeID, key, port));
      }
    },

    addDynamic: async (nodeID: string, port: Realtime.PartialModel<Realtime.Port>): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(Realtime.port.addDynamic({ ...this.engine.context, nodeID, portID: port.id, label: port.label }));
      } else {
        this.dispatch(Creator.addOutDynamicPort(nodeID, port));
      }
    },

    addBuiltin: async (nodeID: string, portType: BaseModels.PortType, port: Realtime.PartialModel<Realtime.Port>): Promise<void> => {
      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.port.addBuiltin({
            ...this.engine.context,
            nodeID,
            portID: port.id,
            type: port.label as BaseModels.PortType,
          })
        );
      } else {
        this.dispatch(Creator.addOutBuiltInPort(nodeID, portType, port));
      }
    },

    removeManyByKey: async (portsToRemove: { portID: string; key: string }[], syncRemove?: () => Promise<void> | void): Promise<void> => {
      const ports = portsToRemove.map(({ portID }) => this.engine.getPortByID(portID)!).filter(Boolean);

      if (!ports.length) return;
      const [{ nodeID }] = ports;

      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(Realtime.port.removeManyByKey({ ...this.engine.context, nodeID, keys: portsToRemove.map(({ key }) => key) }));
      } else {
        const portIDs = portsToRemove.map(({ portID }) => portID);
        const linkIDs = portIDs.flatMap((portID) => this.engine.getLinkIDsByPortID(portID));

        await this.engine.link.removeMany(linkIDs);
        await syncRemove?.();
        this.dispatch(Creator.removeManyOutByKeyPort(portsToRemove));
      }

      this.engine.node.redrawLinks(nodeID);
    },

    removeDynamic: async (portID: string, syncRemove?: () => Promise<void> | void): Promise<void> => {
      const port = this.engine.getPortByID(portID);
      if (!port) return;

      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(Realtime.port.removeDynamic({ ...this.engine.context, nodeID: port.nodeID, portID }));
      } else {
        const linkIDs = this.engine.getLinkIDsByPortID(portID);

        await this.engine.link.removeMany(linkIDs);
        await syncRemove?.();
        this.dispatch(Creator.removeOutDynamicPort(portID));
      }

      this.engine.node.redrawLinks(port.nodeID);
    },

    removeBuiltin: async (portType: BaseModels.PortType, portID: string, syncRemove?: () => Promise<void> | void): Promise<void> => {
      const port = this.engine.getPortByID(portID);
      if (!port) return;

      if (this.isAtomicActionsPhase2) {
        await this.dispatch.sync(
          Realtime.port.removeBuiltin({ ...this.engine.context, nodeID: port.nodeID, portID, type: port.label as BaseModels.PortType })
        );
      } else {
        const linkIDs = this.engine.getLinkIDsByPortID(portID);

        await this.engine.link.removeMany(linkIDs);
        await syncRemove?.();
        this.dispatch(Creator.removeOutBuiltInPort(portType, portID));
      }

      this.engine.node.redrawLinks(port.nodeID);
    },

    /**
     * @deprecated
     */
    reorderDynamicV1: (nodeID: string, from: number, to: number): void => {
      this.dispatch(Creator.reorderOutDynamicPort(nodeID, from, to));

      this.engine.node.redrawLinks(nodeID);
    },

    reorderDynamicV2: async (nodeID: string, portID: string, index: number): Promise<void> => {
      await this.dispatch.sync(Realtime.port.reorderDynamic({ ...this.engine.context, nodeID, portID, index }));

      this.engine.node.redrawLinks(nodeID);
    },
  };

  api(portID: string): PortEntity | null {
    return this.engine.ports.get(portID)?.api ?? null;
  }

  getRect(portID: string): DOMRect | null {
    return this.api(portID)?.instance?.getRect() ?? null;
  }

  /**
   * adds a new byKey out port to a known step
   */
  async addByKey(nodeID: string, key: string, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding out byKey port'), this.log.slug(portID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addOutByKeyPort(nodeID, key, augmentedPort));
    }

    await this.internal.addByKey(nodeID, key, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added out byKey port'), this.log.slug(portID));
  }

  /**
   * adds a new dynamic out port to a known step
   */
  async addDynamic(nodeID: string, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding out dynamic port'), this.log.slug(portID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addOutDynamicPort(nodeID, augmentedPort));
    }

    await this.internal.addDynamic(nodeID, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added out dynamic port'), this.log.slug(portID));
  }

  /**
   * adds a new built-in out port to a known step
   */
  async addBuiltin(nodeID: string, portType: BaseModels.PortType, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID, label: portType };

    this.log.debug(this.log.pending('adding out builtin port'), this.log.slug(portID));

    if (!this.isAtomicActionsPhase2) {
      await this.engine.realtime.sendUpdate(RealtimeDuck.addOutBuiltInPort(nodeID, portType, augmentedPort));
    }

    await this.internal.addBuiltin(nodeID, portType, augmentedPort);
    this.engine.saveHistory();

    this.log.info(this.log.success('added out builtin port'), this.log.slug(portID));
  }

  /**
   * reorders the dynamic out ports of a known step
   */
  async reorderDynamic(nodeID: string, from: number, to: number): Promise<void> {
    this.log.debug(this.log.pending('reordering out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));

    if (this.isAtomicActionsPhase2) {
      const ports = this.engine.select(CreatorV2.portsByNodeIDSelector, { id: nodeID });
      const portID = ports.out.dynamic[from];

      if (!portID) {
        this.log.warn('attempted to reorder a port that could not be found at index', this.log.value(from), 'of node', this.log.slug(nodeID));
        return;
      }

      await this.internal.reorderDynamicV2(nodeID, portID, to);
    } else {
      await this.engine.realtime.sendUpdate(RealtimeDuck.reorderOutDynamicPorts(nodeID, from, to));
      this.internal.reorderDynamicV1(nodeID, from, to);
    }

    this.engine.saveHistory();

    this.log.info(this.log.success('reordered out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));
  }

  /**
   * removes many byKey out port by its key and ID
   */
  async removeManyByKey(portsToRemove: { key: string; portID: string }[]): Promise<void> {
    const portIDs = portsToRemove.map(({ portID }) => portID).join(', ');
    this.log.debug(this.log.pending(`removing ${portIDs.length} byKey ports`));
    await this.internal.removeManyByKey(portsToRemove, () => this.engine.realtime.sendUpdate(RealtimeDuck.removeManyOutByKeyPorts(portsToRemove)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed many out byKey ports'));
  }

  /**
   * removes a dynamic out port by its ID
   */
  async removeDynamic(portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out dynamic port'), this.log.slug(portID));
    await this.internal.removeDynamic(portID, () => this.engine.realtime.sendUpdate(RealtimeDuck.removeOutDynamicPort(portID)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed out dynamic port'), this.log.slug(portID));
  }

  /**
   * removes a built-in out port by its ID
   */
  async removeBuiltin(portType: BaseModels.PortType, portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out builtin port'), this.log.slug(portID));
    await this.internal.removeBuiltin(portType, portID, () => this.engine.realtime.sendUpdate(RealtimeDuck.removeOutBuiltInPort(portType, portID)));
    this.engine.saveHistory();

    this.log.info(this.log.success('removed out builtin port'), this.log.slug(portID));
  }

  redraw(portID: string): void {
    if (!portID) return;
    this.engine.dispatcher.redrawPort(portID);
  }

  redrawLinks(portID: string): void {
    this.engine.getLinkIDsByPortID(portID).forEach((linkID) => this.engine.link.redraw(linkID));
  }
}

export default PortManager;
