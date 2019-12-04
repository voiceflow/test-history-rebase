/* eslint-disable no-underscore-dangle, lodash/prefer-noop */
import * as Realtime from '@/ducks/realtime';

import { EngineConsumer } from './utils';

export const OverlayType = {
  LINK: 'link',
  CURSOR: 'cursor',
};

class RealtimeEngine extends EngineConsumer {
  overlays = {};

  constructor(subscription, engine) {
    super(engine);

    this.teardownHandlers = subscription.onUpdate(async (data, otherTabID, options = {}) => {
      if (data && data.type in this.handlers) {
        await this.handlers[data.type](data.payload, otherTabID, options);
      }
    });
  }

  handlers = {
    [Realtime.LOCK_NODES]: ({ targets, types }, tabID) => {
      this.dispatch(Realtime.addNodeLocks(types, targets, tabID));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.UNLOCK_NODES]: ({ targets, types }) => {
      this.dispatch(Realtime.removeNodeLocks(types, targets));

      if (types.includes(Realtime.LockType.EDIT)) {
        targets.forEach((nodeID) => this.engine.node.redraw(nodeID));
      }
    },
    [Realtime.ADD_NODE]: ({ node, data, nodeID }) => this.engine.node.internal.add(node, data, nodeID),
    [Realtime.ADD_MANY_NODES]: ({ nodeGroup, position }) => this.engine.node.internal.addMany(nodeGroup, position),
    [Realtime.ADD_NESTED_NODE]: ({ parentNodeID, nodeID, node, data, mergedNodeID }) =>
      this.engine.node.internal.addNested(parentNodeID, nodeID, node, data, mergedNodeID),
    [Realtime.INSERT_NESTED_NODE]: ({ parentNodeID, index, nodeID }) => this.engine.node.internal.insertNested(parentNodeID, index, nodeID),
    [Realtime.UNMERGE_NODE]: ({ nodeID, position }) => this.engine.node.internal.unmerge(nodeID, position),
    [Realtime.MERGE_NODES]: ({ mergedNodeID, sourceNodeID, targetNodeID, position }) =>
      this.engine.node.internal.merge(mergedNodeID, sourceNodeID, targetNodeID, position),
    [Realtime.REMOVE_NODE]: (nodeID) => this.engine.node.internal.remove(nodeID),
    [Realtime.REMOVE_MANY_NODES]: (nodeIDs) => this.engine.node.internal.removeMany(nodeIDs),
    [Realtime.UPDATE_NODE_DATA]: ({ nodeID, data }) => this.engine.node.internal.updateData(nodeID, data),
    [Realtime.MOVE_NODE]: ({ nodeID, movement, origin }, _, options) => {
      this.engine.node.internal.translateBaseOnOrigin(nodeID, movement, origin);
      if (!options.volatile) {
        this.engine.node.saveLocation(nodeID);
      }
    },
    [Realtime.MOVE_MANY_NODES]: ({ nodeIDs, movement, origins }, _, options) => {
      this.engine.node.internal.translateManyOnOrigins(nodeIDs, movement, origins);
      if (!options.volatile) {
        nodeIDs.forEach((nodeID) => this.engine.node.saveLocation(nodeID));
      }
    },

    [Realtime.MOVE_LINK]: (linkData, tabID) => this.overlays[OverlayType.LINK]?.moveLink(tabID, linkData),
    [Realtime.ADD_LINK]: ({ sourcePortID, targetPortID, linkID }) => this.engine.link.internal.add(sourcePortID, targetPortID, linkID),
    [Realtime.REMOVE_LINK]: (linkID) => this.engine.link.internal.remove(linkID),

    [Realtime.ADD_PORT]: ({ nodeID, portID, port }) => this.engine.port.internal.add(nodeID, portID, port),
    [Realtime.REMOVE_PORT]: (portID) => this.engine.port.internal.remove(portID),

    [Realtime.MOVE_MOUSE]: (location, tabID) => this.overlays[OverlayType.CURSOR]?.moveMouse(tabID, location),
  };

  sendUpdate(action) {
    return this.dispatch(Realtime.sendRealtimeUpdate(action));
  }

  sendVolatileUpdate(action) {
    return this.dispatch(Realtime.sendRealtimeVolatileUpdate(action));
  }

  sendProjectUpdate(action) {
    return this.dispatch(Realtime.sendRealtimeProjectUpdate(action));
  }

  registerOverlay(key, api) {
    this.overlays[key] = api;
  }

  expireOverlay(key) {
    this.overlays[key] = null;
  }

  panViewport(moveX, moveY) {
    this.overlays[OverlayType.CURSOR]?.panViewport(moveX, moveY);
  }

  zoomViewport(calculateMovement) {
    this.overlays[OverlayType.CURSOR]?.zoomViewport(calculateMovement);
  }

  teardown() {
    this.teardownHandlers();
  }
}

export default RealtimeEngine;
