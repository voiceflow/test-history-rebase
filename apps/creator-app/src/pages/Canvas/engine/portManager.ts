import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';
import PortEntity from '@/pages/Canvas/engine/entities/portEntity';

import { EngineConsumer } from './utils';

class PortManager extends EngineConsumer {
  log = this.engine.log.child('port');

  internal = {
    addByKey: async (nodeID: string, key: string, port: Realtime.PartialModel<Realtime.Port>): Promise<void> => {
      await this.dispatch.partialSync(
        Realtime.port.addByKey({
          ...this.engine.context,
          nodeID,
          portID: port.id,
          label: port.label,
          key,
        })
      );
    },

    addDynamic: async (nodeID: string, port: Realtime.PartialModel<Realtime.Port>, index?: number): Promise<void> => {
      await this.dispatch.partialSync(Realtime.port.addDynamic({ ...this.engine.context, nodeID, portID: port.id, label: port.label, index }));
    },

    addBuiltin: async (nodeID: string, port: Realtime.PartialModel<Realtime.Port>): Promise<void> => {
      await this.dispatch.partialSync(
        Realtime.port.addBuiltin({
          ...this.engine.context,
          nodeID,
          portID: port.id,
          type: port.label as BaseModels.PortType,
        })
      );
    },

    removeManyByKey: async (portsToRemove: { portID: string; key: string }[]): Promise<void> => {
      const ports = portsToRemove.map(({ portID }) => this.engine.getPortByID(portID)!).filter(Boolean);

      if (!ports.length) return;
      const [{ nodeID }] = ports;

      await this.dispatch.partialSync(
        Realtime.port.removeManyByKey({
          ...this.engine.context,
          keys: portsToRemove.map(({ key }) => key),
          nodeID,
          removeNodes: Utils.array.unique(ports.flatMap((port) => this.getTargetActionNodesToRemove(port.id))),
        })
      );

      this.engine.node.redrawLinks(nodeID);
    },

    removeDynamic: async (portID: string): Promise<void> => {
      const port = this.engine.getPortByID(portID);
      if (!port) return;

      await this.dispatch.partialSync(
        Realtime.port.removeDynamic({
          ...this.engine.context,
          nodeID: port.nodeID,
          portID,
          removeNodes: this.getTargetActionNodesToRemove(port.id),
        })
      );

      this.engine.node.redrawLinks(port.nodeID);
    },

    removeBuiltin: async (portID: string): Promise<void> => {
      const port = this.engine.getPortByID(portID);
      if (!port) return;

      await this.dispatch.partialSync(
        Realtime.port.removeBuiltin({
          ...this.engine.context,
          type: port.label as BaseModels.PortType,
          nodeID: port.nodeID,
          portID,
          removeNodes: this.getTargetActionNodesToRemove(port.id),
        })
      );

      this.engine.node.redrawLinks(port.nodeID);
    },

    reorderDynamic: async (nodeID: string, portID: string, index: number): Promise<void> => {
      await this.dispatch.partialSync(Realtime.port.reorderDynamic({ ...this.engine.context, nodeID, portID, index }));

      this.engine.node.redrawLinks(nodeID);
    },
  };

  api(portID: string): PortEntity | null {
    return this.engine.ports.get(portID)?.api ?? null;
  }

  getRect(portID: string): DOMRect | null {
    return this.api(portID)?.instance?.getRect() ?? null;
  }

  getTargetActionNodesToRemove(portID: string) {
    const targetNode = this.select(CreatorV2.targetNodeByPortID, { id: portID });

    if (targetNode?.type !== Realtime.BlockType.ACTIONS) return [];

    return [
      { parentNodeID: targetNode.id },
      ...this.engine.getStepIDsByParentNodeID(targetNode.id).map((stepID) => ({ parentNodeID: targetNode.id, stepID })),
    ];
  }

  /**
   * adds a new byKey out port to a known step
   */
  async addByKey(nodeID: string, key: string, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding out byKey port'), this.log.slug(portID));

    await this.internal.addByKey(nodeID, key, augmentedPort);

    this.log.info(this.log.success('added out byKey port'), this.log.slug(portID));
  }

  /**
   * adds a new dynamic out port to a known step
   */
  async addDynamic(nodeID: string, index?: number, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID };

    this.log.debug(this.log.pending('adding out dynamic port'), this.log.slug(portID));

    await this.internal.addDynamic(nodeID, augmentedPort, index);

    this.log.info(this.log.success('added out dynamic port'), this.log.slug(portID));
  }

  /**
   * adds a new built-in out port to a known step
   */
  async addBuiltin(nodeID: string, portType: BaseModels.PortType, port?: Partial<Realtime.Port>): Promise<void> {
    const portID = Utils.id.objectID();
    const augmentedPort = { ...port, id: portID, label: portType };

    this.log.debug(this.log.pending('adding out builtin port'), this.log.slug(portID));

    await this.internal.addBuiltin(nodeID, augmentedPort);

    this.log.info(this.log.success('added out builtin port'), this.log.slug(portID));
  }

  /**
   * reorders the dynamic out ports of a known step
   */
  async reorderDynamic(nodeID: string, from: number, to: number): Promise<void> {
    this.log.debug(this.log.pending('reordering out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));

    const ports = this.engine.select(CreatorV2.portsByNodeIDSelector, { id: nodeID });
    const portID = ports.out.dynamic[from];

    if (!portID) {
      this.log.warn('attempted to reorder a port that could not be found at index', this.log.value(from), 'of node', this.log.slug(nodeID));
      return;
    }

    await this.internal.reorderDynamic(nodeID, portID, to);

    this.log.info(this.log.success('reordered out dynamic ports'), this.log.slug(nodeID), this.log.diff(from, to));
  }

  /**
   * removes many byKey out port by its key and ID
   */
  async removeManyByKey(portsToRemove: { key: string; portID: string }[]): Promise<void> {
    const portIDs = portsToRemove.map(({ portID }) => portID).join(', ');

    this.log.debug(this.log.pending(`removing ${portIDs.length} byKey ports`));

    await this.internal.removeManyByKey(portsToRemove);

    this.log.info(this.log.success('removed many out byKey ports'));
  }

  /**
   * removes a dynamic out port by its ID
   */
  async removeDynamic(portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out dynamic port'), this.log.slug(portID));

    await this.internal.removeDynamic(portID);

    this.log.info(this.log.success('removed out dynamic port'), this.log.slug(portID));
  }

  /**
   * removes a built-in out port by its ID
   */
  async removeBuiltin(portID: string): Promise<void> {
    this.log.debug(this.log.pending('removing out builtin port'), this.log.slug(portID));

    await this.internal.removeBuiltin(portID);

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
