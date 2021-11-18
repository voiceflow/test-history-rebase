import { MovementCalculator } from '@/components/Canvas/types';
import * as Realtime from '@/ducks/realtime';
import { RealtimeSubscriptionValue } from '@/gates/RealtimeLoadingGate/contexts';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeCursorOverlayAPI, RealtimeLinkOverlayAPI } from '@/pages/Canvas/types';
import { ActionPayload } from '@/store/types';
import { Pair } from '@/types';
import * as Sentry from '@/vendors/sentry';

import type { Engine } from '.';
import { EngineConsumer } from './utils';

const SKIP_WARNING_ACTIONS: string[] = [
  Realtime.SocketAction.LOCK_RESOURCE,
  Realtime.SocketAction.RECONNECT_NOOP,
  Realtime.SocketAction.UNLOCK_RESOURCE,
  Realtime.SocketAction.UPDATE_RESOURCE,
];

class RealtimeEngine extends EngineConsumer<{ [OverlayType.CURSOR]: RealtimeCursorOverlayAPI; [OverlayType.LINK]: RealtimeLinkOverlayAPI }> {
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
      Sentry.breadcrumb('realtime', 'Remote user locked nodes', { tabID });

      this.dispatch(Realtime.addNodeLocks(types, targets, tabID));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.UNLOCK_NODES]: ({ targets, types }: ActionPayload<Realtime.UnlockNodes>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user unlocked nodes', { tabID });

      this.dispatch(Realtime.removeNodeLocks(types, targets));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.SocketAction.ADD_NODE]: ({ node, data, parentNode }: ActionPayload<Realtime.AddNode>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added node', { tabID });

      return this.engine.node.internal.add(node, data, parentNode);
    },
    [Realtime.SocketAction.ADD_MANY_NODES]: ({ entities, position }: ActionPayload<Realtime.AddManyNodes>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added multiple nodes', { tabID });

      return this.engine.node.internal.addMany(entities, position);
    },
    [Realtime.SocketAction.ADD_NESTED_NODE]: ({ parentNodeID, node, data, mergedNodeID }: ActionPayload<Realtime.AddNestedNode>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added nested node', { tabID });

      return this.engine.node.internal.addNested(parentNodeID, node, data, mergedNodeID);
    },
    [Realtime.SocketAction.INSERT_NESTED_NODE]: ({ parentNodeID, index, nodeID }: ActionPayload<Realtime.InsertNestedNode>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user inserted nested node', { tabID });

      return this.engine.node.internal.insertNested(parentNodeID, index, nodeID);
    },
    [Realtime.SocketAction.UNMERGE_NODE]: ({ nodeID, position, parentNode }: ActionPayload<Realtime.UnmergeNode>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user unmerged node', { tabID });

      return this.engine.node.internal.unmerge(nodeID, position, parentNode);
    },
    [Realtime.SocketAction.REMOVE_MANY_NODES]: (nodeIDs: ActionPayload<Realtime.RemoveManyNodes>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user removed multiple nodes', { tabID });

      return this.engine.node.internal.removeMany(nodeIDs);
    },
    [Realtime.SocketAction.UPDATE_NODE_DATA]: ({ nodeID, data }: ActionPayload<Realtime.UpdateNodeData>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user updated node data', { tabID, data });

      return this.engine.node.internal.updateData(nodeID, data);
    },
    [Realtime.SocketAction.MOVE_NODE]: ({ nodeID, movement, origin }: ActionPayload<Realtime.MoveNode>, tabID, options) => {
      this.engine.node.internal.translateBaseOnOrigin(nodeID, movement, origin);

      if (!options?.volatile) {
        Sentry.breadcrumb('realtime', 'Remote user finished moving node', { tabID });
        this.engine.node.internal.saveLocation(nodeID);
      }
    },
    [Realtime.SocketAction.MOVE_MANY_NODES]: ({ nodeIDs, movement, origins }: ActionPayload<Realtime.MoveManyNodes>, tabID, options) => {
      this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);

      if (!options?.volatile) {
        Sentry.breadcrumb('realtime', 'Remote user finished moving multiple nodes', { tabID });
        nodeIDs.forEach((nodeID) => this.engine.node.internal.saveLocation(nodeID));
      }
    },

    [Realtime.SocketAction.ADD_LINK]: ({ sourcePortID, targetPortID, linkID }: ActionPayload<Realtime.AddLink>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added link', { tabID });

      return this.engine.link.internal.add(sourcePortID, targetPortID, linkID);
    },

    [Realtime.SocketAction.UPDATE_LINK_DATA]: ({ linkID, data }: ActionPayload<Realtime.UpdateLinkData>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user update link data', { tabID });

      return this.engine.link.internal.updateData(linkID, data);
    },

    [Realtime.SocketAction.UPDATE_LINK_DATA_MANY]: (payload: ActionPayload<Realtime.UpdateLinkDataMany>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user update link data many', { tabID });

      return this.engine.link.internal.updateDataMany(payload);
    },

    [Realtime.SocketAction.REMOVE_LINK]: (linkID: ActionPayload<Realtime.RemoveLink>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user removed link', { tabID });

      return this.engine.link.internal.remove(linkID);
    },

    [Realtime.SocketAction.MOVE_LINK]: (linkData: ActionPayload<Realtime.MoveLink>, tabID) =>
      this.components[OverlayType.LINK]?.moveLink(tabID, linkData),

    [Realtime.SocketAction.ADD_OUT_DYNAMIC_PORT]: ({ nodeID, port }: ActionPayload<Realtime.AddOutDynamicPort>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added dynamic port', { tabID });

      return this.engine.port.internal.addOutDynamic(nodeID, port);
    },
    [Realtime.SocketAction.ADD_OUT_BUILT_IN_PORT]: ({ nodeID, port, portType }: ActionPayload<Realtime.AddOutBuiltInPort>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user added builtIn port', { tabID });

      return this.engine.port.internal.addOutBuiltIn(nodeID, portType, port);
    },

    [Realtime.SocketAction.REMOVE_OUT_DYNAMIC_PORT]: (portID: ActionPayload<Realtime.RemoveOutDynamicPort>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user removed dynamic port', { tabID });

      return this.engine.port.internal.removeOutDynamic(portID);
    },
    [Realtime.SocketAction.REMOVE_OUT_BUILT_IN_PORT]: ({ portID, portType }: ActionPayload<Realtime.RemoveOutBuiltInPort>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user removed builtIn port', { tabID });

      return this.engine.port.internal.removeOutBuiltIn(portType, portID);
    },

    [Realtime.SocketAction.REORDER_OUT_DYNAMIC_PORTS]: ({ nodeID, from, to }: ActionPayload<Realtime.ReorderOutDynamicPorts>, tabID) => {
      Sentry.breadcrumb('realtime', 'Remote user reordered out dynamic ports', { tabID });

      return this.engine.port.internal.reorderOutDynamic(nodeID, from, to);
    },

    [Realtime.SocketAction.MOVE_MOUSE]: (location: ActionPayload<Realtime.MoveMouse>, tabID) =>
      this.components[OverlayType.CURSOR]?.moveMouse(tabID, location),
  };

  sendUpdate(action: Realtime.AnySocketAction) {
    Sentry.breadcrumb('realtime', 'Sending diagram update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeUpdate(action));
  }

  sendVolatileUpdate(action: Realtime.AnySocketAction) {
    return this.dispatch(Realtime.sendRealtimeVolatileUpdate(action));
  }

  sendProjectUpdate(action: Realtime.AnySocketAction) {
    Sentry.breadcrumb('realtime', 'Sending project update', { type: action.type });

    return this.dispatch(Realtime.sendRealtimeProjectUpdate(action));
  }

  panViewport(movement: Pair<number>) {
    this.components[OverlayType.CURSOR]?.panViewport(movement);
  }

  zoomViewport(calculateMovement: MovementCalculator) {
    this.components[OverlayType.CURSOR]?.zoomViewport(calculateMovement);
  }

  teardown() {
    this.teardownHandlers();
  }
}

export default RealtimeEngine;
