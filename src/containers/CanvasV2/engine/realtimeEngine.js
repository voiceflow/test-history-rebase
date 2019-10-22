/* eslint-disable no-underscore-dangle, lodash/prefer-noop */
import client from '@/client';
import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import { tabIDSelector } from '@/ducks/session';

import { EngineConsumer } from './utils';

const ServerEvent = {
  NEW_USER: 'NEW_USER',
  USER_LEFT: 'USER_LEFT',
};

class RealtimeEngine extends EngineConsumer {
  overlay = null;

  constructor(engine) {
    super(engine);

    const tabID = tabIDSelector(engine.store.getState());
    this.subscription = client.socket.realtime.createSubscription(
      tabID,
      (timestamp) => this.dispatch(Realtime.updateLastTimestamp(timestamp)),
      () => {
        throw new Error('socket failed, reload page');
      }
    );

    this.subscription.on(ServerEvent.NEW_USER, (otherTabID, { type, ...viewer }) => this.dispatch(Realtime.addDiagramViewer(otherTabID, viewer)));
    this.subscription.on(ServerEvent.USER_LEFT, (otherTabID) => {
      this.dispatch(Realtime.removeDiagramViewer(otherTabID));

      if (this.overlay) {
        this.overlay.removeUser(otherTabID);
      }
    });
    this.subscription.onUpdate((otherTabID, data) => {
      if (data && data.type in this.handlers) {
        this.handlers[data.type](data.payload);
      }
    });
    this.subscription.onMoveMouse((otherTabID, location) => {
      if (this.overlay) {
        this.overlay.moveMouse(otherTabID, location);
      }
    });
  }

  handlers = {
    [Realtime.ADD_NODE]: ({ node, data, nodeID }) => this.engine.node.internal.add(node, data, nodeID),
    [Realtime.COPY_NODE]: ({ node, data, position }) => this.engine.node.internal.copy(node, data, position),
    [Realtime.REMOVE_NODE]: (nodeID) => this.engine.node.internal.remove(nodeID),
    [Realtime.REMOVE_MANY_NODES]: (nodeIDs) => this.engine.node.internal.removeMany(nodeIDs),
    [Realtime.UPDATE_NODE_DATA]: ({ nodeID, data }) => this.dispatch(Creator.updateNodeData(nodeID, data)),
    [Realtime.UPDATE_NODE_DATA]: ({ nodeID, data }) => this.engine.node.internal.updateData(nodeID, data),
    [Realtime.MOVE_NODE]: ({ nodeID, movement }) => this.engine.node.internal.translate(nodeID, movement),
    [Realtime.MOVE_MANY_NODES]: ({ nodeIDs, movement }) => this.engine.node.internal.translateMany(nodeIDs, movement),

    [Realtime.ADD_LINK]: ({ sourcePortID, targetPortID, linkID }) => this.engine.link.internal.add(sourcePortID, targetPortID, linkID),
    [Realtime.REMOVE_LINK]: (linkID) => this.engine.link.internal.remove(linkID),

    [Realtime.ADD_PORT]: ({ nodeID, portID, port }) => this.engine.port.internal.add(nodeID, portID, port),
    [Realtime.REMOVE_PORT]: (portID) => this.engine.port.internal.remove(portID),

    [Realtime.SET_FOCUS]: () => {},
    [Realtime.CLEAR_FOCUS]: () => {},

    [Realtime.ADD_TO_SELECTION]: () => {},
    [Realtime.REMOVE_FROM_SELECTION]: () => {},
    [Realtime.REPLACE_SELECTION]: () => {},
    [Realtime.CLEAR_SELECTION]: () => {},
  };

  registerOverlay(api) {
    this.overlay = api;
  }

  expireOverlay() {
    this.overlay = null;
  }

  panViewport(moveX, moveY) {
    if (this.overlay) {
      this.overlay.panViewport(moveX, moveY);
    }
  }

  zoomViewport(calculateMovement) {
    if (this.overlay) {
      this.overlay.zoomViewport(calculateMovement);
    }
  }

  teardown() {
    this.subscription.destroy();
  }
}

export default RealtimeEngine;
