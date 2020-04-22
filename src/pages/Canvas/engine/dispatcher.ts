import EventEmitter from 'eventemitter3';
import React from 'react';

import { dataByNodeIDSelector, linkByIDSelector, nodeByIDSelector, portByIDSelector } from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import { Link, Node, NodeData, Port } from '@/models';
import { hasActiveLinksSelector } from '@/store/selectors';
import { Selector } from '@/store/types';

import { EngineConsumer, extractPoints } from './utils';
import type { Engine } from '.';

enum DispatchChannel {
  NODE = 'node',
  DATA = 'data',
  PORT = 'port',
  LINK = 'link',
}

const CHANNEL_SELECTORS: Record<DispatchChannel, Selector<any>> = {
  [DispatchChannel.NODE]: nodeByIDSelector,
  [DispatchChannel.DATA]: dataByNodeIDSelector,
  [DispatchChannel.PORT]: portByIDSelector,
  [DispatchChannel.LINK]: linkByIDSelector,
};

class Dispatcher extends EngineConsumer {
  prevStates: Record<string, unknown> = {};

  emitter = new EventEmitter<string>();

  unsubscribe: () => void;

  constructor(engine: Engine) {
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

  subscribe<T>(channel: DispatchChannel, event: string, handler: (value: T) => void) {
    const eventKey = `${channel}:${event}`;

    this.emitter.on(eventKey, handler);

    return () => {
      this.emitter.off(eventKey, handler);
    };
  }

  useSubscription<T>(channel: DispatchChannel, key: string) {
    const [[value], updateValue] = React.useState<[T, number]>(() => [this.select(CHANNEL_SELECTORS[channel])(key), -1]);

    React.useEffect(
      () => this.subscribe<T>(channel, key, (nextValue) => updateValue([nextValue, Math.random()])),
      []
    );

    return value;
  }

  useNode(nodeID: string) {
    const node = this.useSubscription<Node>(DispatchChannel.NODE, nodeID);
    const lockOwner = this.select(Realtime.editLockOwnerSelector)(nodeID);
    const isHighlighted = this.engine.isActive(nodeID);

    return { nodeID, node, isHighlighted, lockOwner };
  }

  useNodeData(nodeID: string) {
    const data = this.useSubscription<NodeData<unknown>>(DispatchChannel.DATA, nodeID);

    return { nodeID, data };
  }

  usePort(portID: string) {
    const port = this.useSubscription<Port>(DispatchChannel.PORT, portID);
    const hasActiveLinks = this.select(hasActiveLinksSelector)(portID);

    return { portID, port, hasActiveLinks };
  }

  useLink(linkID: string) {
    const link = this.useSubscription<Link>(DispatchChannel.LINK, linkID);

    const getPortRect = (relationship: 'source' | 'target') => this.engine.port.getRect(link[relationship].portID);

    const sourcePort = this.engine.getPortByID(link.source.portID);
    const targetPort = this.engine.getPortByID(link.target.portID);

    const hasPorts = sourcePort && targetPort && this.engine.port.api(sourcePort.id)?.isReady() && this.engine.port.api(targetPort.id)?.isReady();

    return {
      linkID,
      link,
      points: hasPorts && extractPoints(this.engine.canvas!, getPortRect('source'), getPortRect('target')),
      isActive: this.engine.isBranchActive(link.source.nodeID) || this.engine.isBranchActive(link.target.nodeID),
    };
  }

  redraw(eventKey: string, shouldRedraw = (nextState: any) => nextState !== this.prevStates[eventKey]) {
    const state = this.engine.store.getState();
    const [channel, key] = eventKey.split(':') as [DispatchChannel, string];

    const nextState = CHANNEL_SELECTORS[channel](state)(key);

    if (shouldRedraw(nextState)) {
      this.emitter.emit(eventKey, nextState);
    }

    this.prevStates[eventKey] = nextState;
  }

  forceRedraw(channel: DispatchChannel, key: string) {
    // eslint-disable-next-line lodash/prefer-constant
    this.redraw(`${channel}:${key}`, () => true);
  }

  redrawNode(nodeID: string) {
    this.forceRedraw(DispatchChannel.NODE, nodeID);
  }

  redrawPort(portID: string) {
    this.forceRedraw(DispatchChannel.PORT, portID);
  }

  redrawLink(linkID: string) {
    this.forceRedraw(DispatchChannel.LINK, linkID);
  }

  reset() {
    this.emitter.removeAllListeners();
  }

  teardown() {
    this.unsubscribe();
  }
}

export default Dispatcher;
