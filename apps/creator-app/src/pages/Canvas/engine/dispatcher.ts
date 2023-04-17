import EventEmitter from 'eventemitter3';
import React from 'react';

import type Engine from '.';
import { EntityType } from './constants';
import { EngineConsumer } from './utils';

class Dispatcher extends EngineConsumer {
  log = this.engine.log.child('dispatcher');

  emitter = new EventEmitter<string>();

  unsubscribe: () => void;

  constructor(engine: Engine) {
    super(engine);

    this.unsubscribe = engine.store.subscribe(() => {
      const eventNames = this.emitter.eventNames();

      eventNames.forEach((eventKey) => this.redraw(eventKey));
    });
  }

  subscribe(type: EntityType, id: string, handler: (isForced: boolean) => void) {
    const eventKey = `${type}:${id}`;

    this.emitter.on(eventKey, handler);

    return () => {
      this.emitter.off(eventKey, handler);
    };
  }

  useSubscription(type: EntityType, id: string, handler: (isForced: boolean) => void) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => this.subscribe(type, id, handler), []);
  }

  redraw(eventKey: string, isForced = false) {
    this.emitter.emit(eventKey, isForced);
  }

  redrawEntity(type: EntityType, id?: string) {
    if (!id) return;
    this.log.debug(`redraw ${type}`, this.log.slug(id));
    this.redraw(`${type}:${id}`, true);
  }

  redrawNode(nodeID: string) {
    this.redrawEntity(EntityType.NODE, nodeID);
  }

  redrawPort(portID: string) {
    this.redrawEntity(EntityType.PORT, portID);
  }

  redrawLink(linkID: string) {
    this.redrawEntity(EntityType.LINK, linkID);
  }

  redrawThread(threadID: string) {
    this.redrawEntity(EntityType.THREAD, threadID);
  }

  reset() {
    this.emitter.removeAllListeners();
  }

  teardown() {
    this.unsubscribe();
  }
}

export default Dispatcher;
