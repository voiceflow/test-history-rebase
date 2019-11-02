import EventEmitter from 'eventemitter3';
import React from 'react';

import { CanvasContext } from '@/components/Canvas/contexts';
import { dataByNodeIDSelector, linkByIDSelector, nodeByIDSelector, portByIDSelector } from '@/ducks/creator';
import { hasActiveLinksSelector } from '@/store/selectors';

import { EngineConsumer, extractPoints } from './utils';

const DispatchChannel = {
  NODE: 'node',
  DATA: 'data',
  PORT: 'port',
  LINK: 'link',
};

const CHANNEL_SELECTORS = {
  [DispatchChannel.NODE]: nodeByIDSelector,
  [DispatchChannel.DATA]: dataByNodeIDSelector,
  [DispatchChannel.PORT]: portByIDSelector,
  [DispatchChannel.LINK]: linkByIDSelector,
};

class Dispatcher extends EngineConsumer {
  prevStates = {};

  emitter = new EventEmitter();

  constructor(engine) {
    super(engine);

    this.unsubscribe = engine.store.subscribe(() => {
      const eventNames = this.emitter.eventNames();

      Object.keys(this.prevStates)
        .filter((key) => !eventNames.includes(key))
        .forEach((key) => {
          this.prevStates[key] = null;
        });

      eventNames.forEach((eventKey) => this.redraw(eventKey));
    });
  }

  subscribe(channel, event, handler) {
    const eventKey = `${channel}:${event}`;

    this.emitter.on(eventKey, handler);

    return () => this.emitter.off(eventKey, handler);
  }

  useSubscription(channel, key) {
    const [[value], updateValue] = React.useState(() => [this.select(CHANNEL_SELECTORS[channel])(key), -1]);

    React.useEffect(() => this.subscribe(channel, key, (nextValue) => updateValue([nextValue, Math.random()])), []);

    return value;
  }

  useNode(nodeID) {
    const node = this.useSubscription(DispatchChannel.NODE, nodeID);
    const isHighlighted = this.engine.isActive(nodeID);

    return { nodeID, node, isHighlighted };
  }

  useNodeData(nodeID) {
    const data = this.useSubscription(DispatchChannel.DATA, nodeID);

    return { nodeID, data };
  }

  usePort(portID) {
    const port = this.useSubscription(DispatchChannel.PORT, portID);
    const hasActiveLinks = this.select(hasActiveLinksSelector)(portID);

    return { portID, port, hasActiveLinks };
  }

  useLink(linkID) {
    const link = this.useSubscription(DispatchChannel.LINK, linkID);
    const canvas = React.useContext(CanvasContext);

    const getPortRect = (relationship) => this.engine.port.getRect(link[relationship].portID);

    const sourcePort = this.engine.getPortByID(link.source.portID);
    const targetPort = this.engine.getPortByID(link.target.portID);
    const hasPorts = sourcePort && targetPort && this.engine.ports.has(sourcePort.id) && this.engine.ports.has(targetPort.id);

    return {
      linkID,
      link,
      points: hasPorts && extractPoints(canvas, getPortRect('source'), getPortRect('target')),
    };
  }

  redraw(eventKey, shouldRedraw = (nextState) => nextState !== this.prevStates[eventKey]) {
    const state = this.engine.store.getState();
    const [channel, key] = eventKey.split(':');

    const nextState = CHANNEL_SELECTORS[channel](state)(key);

    if (shouldRedraw(nextState)) {
      this.emitter.emit(eventKey, nextState);
    }

    this.prevStates[eventKey] = nextState;
  }

  forceRedraw(channel, key) {
    // eslint-disable-next-line lodash/prefer-constant
    this.redraw(`${channel}:${key}`, () => true);
  }

  redrawNode(nodeID) {
    this.forceRedraw(DispatchChannel.NODE, nodeID);
  }

  redrawPort(portID) {
    this.forceRedraw(DispatchChannel.PORT, portID);
  }

  redrawLink(linkID) {
    this.forceRedraw(DispatchChannel.LINK, linkID);
  }

  teardown() {
    this.unsubscribe();
    this.emitter.removeAllListeners();
  }
}

export default Dispatcher;
