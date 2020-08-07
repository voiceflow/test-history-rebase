/* eslint-disable lodash/prefer-noop */
import { MovementCalculator } from '@/components/Canvas/types';
import * as Realtime from '@/ducks/realtime';
import { RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeCursorOverlayAPI, RealtimeLinkOverlayAPI } from '@/pages/Canvas/types';
import { ActionPayload } from '@/store/types';
import { Pair } from '@/types';

import { EngineConsumer } from './utils';
import type { Engine } from '.';

class RealtimeEngine extends EngineConsumer {
  log = this.engine.log.child('realtime');

  overlays: {
    [OverlayType.CURSOR]: RealtimeCursorOverlayAPI | null;
    [OverlayType.LINK]: RealtimeLinkOverlayAPI | null;
  } = {
    [OverlayType.CURSOR]: null,
    [OverlayType.LINK]: null,
  };

  teardownHandlers: () => void;

  constructor(subscription: RealtimeSubscriptionValue, engine: Engine) {
    super(engine);

    this.teardownHandlers = subscription.onUpdate(async (action, otherTabID, options = {}) => {
      if (action && action.type in this.handlers) {
        await this.handlers[action.type as Realtime.SocketAction]!(action.payload, otherTabID, options);
      }
    });
  }

  handlers: Partial<Record<Realtime.SocketAction, (payload: any, tabID: string, options?: { volatile?: boolean }) => Promise<void> | unknown>> = {
    [Realtime.SocketAction.LOCK_NODES]: ({ targets, types }: ActionPayload<Realtime.LockNodes>, tabID) => {
      this.dispatch(Realtime.addNodeLocks(types, targets, tabID));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.UNLOCK_NODES]: ({ targets, types }: ActionPayload<Realtime.UnlockNodes>) => {
      this.dispatch(Realtime.removeNodeLocks(types, targets));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.ADD_NODE]: ({ node, data, parentNode }: ActionPayload<Realtime.AddNode>) =>
      this.engine.node.internal.add(node, data, parentNode),
    [Realtime.SocketAction.ADD_MANY_NODES]: ({ entities, position }: ActionPayload<Realtime.AddManyNodes>) =>
      this.engine.node.internal.addMany(entities, position),
    [Realtime.SocketAction.ADD_NESTED_NODE]: ({ parentNodeID, node, data, mergedNodeID }: ActionPayload<Realtime.AddNestedNode>) =>
      this.engine.node.internal.addNested(parentNodeID, node, data, mergedNodeID),
    [Realtime.SocketAction.INSERT_NESTED_NODE]: ({ parentNodeID, index, nodeID }: ActionPayload<Realtime.InsertNestedNode>) =>
      this.engine.node.internal.insertNested(parentNodeID, index, nodeID),
    [Realtime.SocketAction.UNMERGE_NODE]: ({ nodeID, position, parentNode }: ActionPayload<Realtime.UnmergeNode>) =>
      this.engine.node.internal.unmerge(nodeID, position, parentNode),
    [Realtime.SocketAction.REMOVE_NODE]: (nodeID: ActionPayload<Realtime.RemoveNode>) => this.engine.node.internal.remove(nodeID),
    [Realtime.SocketAction.REMOVE_MANY_NODES]: (nodeIDs: ActionPayload<Realtime.RemoveManyNodes>) => this.engine.node.internal.removeMany(nodeIDs),
    [Realtime.SocketAction.UPDATE_NODE_DATA]: ({ nodeID, data }: ActionPayload<Realtime.UpdateNodeData>) =>
      this.engine.node.internal.updateData(nodeID, data),
    [Realtime.SocketAction.MOVE_NODE]: ({ nodeID, movement, origin }: ActionPayload<Realtime.MoveNode>, _, options) => {
      this.engine.node.internal.translateBaseOnOrigin(nodeID, movement, origin);
      if (!options?.volatile) {
        this.engine.node.saveLocation(nodeID);
      }
    },
    [Realtime.SocketAction.MOVE_MANY_NODES]: ({ nodeIDs, movement, origins }: ActionPayload<Realtime.MoveManyNodes>, _, options) => {
      this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);
      if (!options?.volatile) {
        nodeIDs.forEach((nodeID) => this.engine.node.saveLocation(nodeID));
      }
    },

    [Realtime.SocketAction.ADD_LINK]: ({ sourcePortID, targetPortID, linkID }: ActionPayload<Realtime.AddLink>) =>
      this.engine.link.internal.add(sourcePortID, targetPortID, linkID),
    [Realtime.SocketAction.REMOVE_LINK]: (linkID: ActionPayload<Realtime.RemoveLink>) => this.engine.link.internal.remove(linkID),

    [Realtime.SocketAction.MOVE_LINK]: (linkData: ActionPayload<Realtime.MoveLink>, tabID) =>
      this.overlays[OverlayType.LINK]?.moveLink(tabID, linkData),

    [Realtime.SocketAction.ADD_PORT]: ({ nodeID, port }: ActionPayload<Realtime.AddPort>) => this.engine.port.internal.add(nodeID, port),
    [Realtime.SocketAction.REMOVE_PORT]: (portID: ActionPayload<Realtime.RemovePort>) => this.engine.port.internal.remove(portID),
    [Realtime.SocketAction.REORDER_PORTS]: ({ nodeID, from, to }: ActionPayload<Realtime.ReorderPorts>) =>
      this.engine.port.internal.reorder(nodeID, from, to),

    [Realtime.SocketAction.MOVE_MOUSE]: (location: ActionPayload<Realtime.MoveMouse>, tabID) =>
      this.overlays[OverlayType.CURSOR]?.moveMouse(tabID, location),
  };

  sendUpdate(action: Realtime.AnySocketAction) {
    return this.dispatch(Realtime.sendRealtimeUpdate(action));
  }

  sendVolatileUpdate(action: Realtime.AnySocketAction) {
    return this.dispatch(Realtime.sendRealtimeVolatileUpdate(action));
  }

  sendProjectUpdate(action: Realtime.AnySocketAction) {
    return this.dispatch(Realtime.sendRealtimeProjectUpdate(action));
  }

  registerOverlay<K extends keyof RealtimeEngine['overlays']>(key: K, api: RealtimeEngine['overlays'][K]) {
    this.overlays[key] = api;

    this.log.debug(this.log.init('registered overlay'), this.log.value(key));
  }

  expireOverlay(key: keyof RealtimeEngine['overlays']) {
    this.overlays[key] = null;

    this.log.debug(this.log.init('expired overlay'), this.log.value(key));
  }

  panViewport(movement: Pair<number>) {
    this.overlays[OverlayType.CURSOR]?.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator) {
    this.overlays[OverlayType.CURSOR]?.zoomViewport(calculateMovement);
  }

  teardown() {
    this.teardownHandlers();
  }
}

export default RealtimeEngine;
