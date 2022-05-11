import { MovementCalculator } from '@/components/Canvas/types';
import * as Realtime from '@/ducks/realtime';
import { RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeCursorOverlayAPI } from '@/pages/Canvas/types';
import { ActionPayload } from '@/store/types';
import { Pair } from '@/types';
import * as Sentry from '@/vendors/sentry';

import type Engine from '.';
import { EngineConsumer } from './utils';

const SKIP_WARNING_ACTIONS: string[] = [Realtime.SocketAction.RECONNECT_NOOP];

class RealtimeEngine extends EngineConsumer<{ [OverlayType.CURSOR]: RealtimeCursorOverlayAPI }> {
  log = this.engine.log.child('realtime');

  teardownHandlers: () => void;

  constructor(subscription: RealtimeSubscriptionValue, engine: Engine) {
    super(engine);

    this.teardownHandlers = subscription.onUpdate(async (action, otherTabID, options = {}) => {
      const isRegistered = this.select(Realtime.isTabRegisteredSelector)(otherTabID);

      if (!isRegistered) {
        Sentry.error(`Unable to apply realtime action from unregistered tab: ${otherTabID}`);
        return;
      }

      if (action && action.type in this.handlers) {
        await this.handlers[action.type as Realtime.SocketAction]!(action.payload, otherTabID, options);
      } else if (!action || !SKIP_WARNING_ACTIONS.includes(action.type)) {
        Sentry.error(`Failed to apply unknown realtime action: ${action?.type}`);
      }
    });
  }

  handlers: Partial<Record<Realtime.SocketAction, (payload: any, tabID: string, options?: { volatile?: boolean }) => Promise<void> | unknown>> = {
    [Realtime.SocketAction.LOCK_NODES]: ({ targets, types }: ActionPayload<Realtime.LockNodes>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user locked nodes', { tabID });

      this.dispatch(Realtime.addNodeLocks(types, targets, tabID));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.UNLOCK_NODES]: ({ targets, types }: ActionPayload<Realtime.UnlockNodes>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user unlocked nodes', { tabID });

      this.dispatch(Realtime.removeNodeLocks(types, targets));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.ADD_NODE]: async ({ node, data, parentNode }: ActionPayload<Realtime.AddNode>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user added node', { tabID });

      await this.engine.node.internal.addV1(node, data, parentNode);
    },
    [Realtime.SocketAction.ADD_MANY_NODES]: async ({ entities }: ActionPayload<Realtime.AddManyNodes>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added multiple nodes', { tabID });

      await this.engine.node.internal.importSnapshot(entities);
    },
    [Realtime.SocketAction.ADD_NESTED_NODE]: async ({ parentNodeID, node, data }: ActionPayload<Realtime.AddNestedNode>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user added nested node', { tabID });

      await this.engine.node.internal.appendStep(parentNodeID, node, data);
    },
    [Realtime.SocketAction.INSERT_NESTED_NODE]: async ({ parentNodeID, index, nodeID }: ActionPayload<Realtime.InsertNestedNode>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user inserted nested node', { tabID });

      this.engine.node.internal.insertNestedNode(parentNodeID, index, nodeID);
    },
    [Realtime.SocketAction.UNMERGE_NODE]: async ({ nodeID, position, parentNode }: ActionPayload<Realtime.UnmergeNode>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user unmerged node', { tabID });

      await this.engine.node.internal.isolateStep(nodeID, position, parentNode);
    },
    [Realtime.SocketAction.REMOVE_MANY_NODES]: async (nodeIDs: ActionPayload<Realtime.RemoveManyNodes>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user removed multiple nodes', { tabID });

      await this.engine.node.internal.removeMany(nodeIDs);
    },
    [Realtime.SocketAction.UPDATE_NODE_DATA]: ({ nodeID, data }: ActionPayload<Realtime.UpdateNodeData>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user updated node data', { tabID, data });

      return this.engine.node.internal.updateData(nodeID, data);
    },
    [Realtime.SocketAction.MOVE_MANY_NODES]: async ({ nodeIDs, movement, origins }: ActionPayload<Realtime.MoveManyNodes>, tabID, options) => {
      this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);

      if (!options?.volatile && !this.isAtomicActionsPhase2) {
        Sentry.breadcrumb('realtime', 'Remote user finished moving multiple nodes', { tabID });
        await Promise.all(nodeIDs.map((nodeID) => this.engine.node.internal.saveLocation(nodeID)));
      }
    },

    [Realtime.SocketAction.ADD_LINK]: async ({ sourcePortID, targetPortID, linkID }: ActionPayload<Realtime.AddLink>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user added link', { tabID });

      await this.engine.link.internal.add(sourcePortID, targetPortID, linkID);
    },

    [Realtime.SocketAction.UPDATE_LINK_DATA_MANY]: async (payload: ActionPayload<Realtime.UpdateLinkDataMany>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user update link data many', { tabID });

      await this.engine.link.internal.patchMany(payload);
    },

    [Realtime.SocketAction.REMOVE_MANY_LINKS]: async (linkIDs: ActionPayload<Realtime.RemoveManyLinks>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user removed many links', { tabID });

      await this.engine.link.internal.removeMany(linkIDs);
    },

    [Realtime.SocketAction.ADD_OUT_DYNAMIC_PORT]: async ({ nodeID, port }: ActionPayload<Realtime.AddOutDynamicPort>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user added dynamic port', { tabID });

      await this.engine.port.internal.addDynamic(nodeID, port);
    },
    [Realtime.SocketAction.ADD_OUT_BUILT_IN_PORT]: async ({ nodeID, port, portType }: ActionPayload<Realtime.AddOutBuiltInPort>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user added builtIn port', { tabID });

      await this.engine.port.internal.addBuiltin(nodeID, portType, port);
    },

    [Realtime.SocketAction.REMOVE_OUT_DYNAMIC_PORT]: async (portID: ActionPayload<Realtime.RemoveOutDynamicPort>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user removed dynamic port', { tabID });

      await this.engine.port.internal.removeDynamic(portID);
    },

    [Realtime.SocketAction.REMOVE_OUT_BUILT_IN_PORT]: async ({ portID, portType }: ActionPayload<Realtime.RemoveOutBuiltInPort>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user removed builtIn port', { tabID });

      await this.engine.port.internal.removeBuiltin(portType, portID);
    },

    [Realtime.SocketAction.REORDER_OUT_DYNAMIC_PORTS]: async ({ nodeID, from, to }: ActionPayload<Realtime.ReorderOutDynamicPorts>, tabID) => {
      if (this.isAtomicActionsPhase2) return;

      Sentry.breadcrumb('realtime', 'Remote user reordered out dynamic ports', { tabID });

      this.engine.port.internal.reorderDynamicV1(nodeID, from, to);
    },

    [Realtime.SocketAction.MOVE_MOUSE]: (location: ActionPayload<Realtime.MoveMouse>, tabID) =>
      this.components[OverlayType.CURSOR]?.moveMouse(tabID, location),
  };

  sendUpdate(action: Realtime.AnySocketAction): Promise<void> {
    Sentry.breadcrumb('realtime', 'Sending diagram update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeUpdate(action));
  }

  sendVolatileUpdate(action: Realtime.AnySocketAction): void {
    return this.dispatch(Realtime.sendRealtimeVolatileUpdate(action));
  }

  sendProjectUpdate(action: Realtime.AnySocketAction): Promise<void> {
    Sentry.breadcrumb('realtime', 'Sending project update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeProjectUpdate(action));
  }

  panViewport(movement: Pair<number>): void {
    this.components[OverlayType.CURSOR]?.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator): void {
    this.components[OverlayType.CURSOR]?.zoomViewport(calculateMovement);
  }

  teardown(): void {
    this.teardownHandlers();
  }
}

export default RealtimeEngine;
