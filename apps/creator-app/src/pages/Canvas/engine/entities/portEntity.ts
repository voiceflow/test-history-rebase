import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import { useSetup } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts/Engine.context';

import type Engine from '..';
import { EntityType } from '../constants';
import { EntityInstance, isDirectlyEqual, ResourceEntity } from './entity';

export type PortInstance = EntityInstance & {
  /**
   * get the DOMRect of the rendered port
   */
  getRect: () => DOMRect | null;
};

class PortEntity extends ResourceEntity<Realtime.Port, PortInstance> {
  get isHighlighted() {
    return this.engine.highlight.isPortTarget(this.portID);
  }

  get isPrototypeHighlighted() {
    return this.engine.prototype.isPortHighlighted(this.portID);
  }

  get isLinkCreationHighlighted() {
    return this.engine.linkCreation.isSourcePort(this.portID);
  }

  get isFinalPrototypePort() {
    const port = this.engine.getPortByID(this.portID);
    if (!port) return false;

    return this.engine.prototype.finalNodeID === port.nodeID;
  }

  get isFinalPrototypeUnlinkedPort() {
    const finalPrototypePort = this.isFinalPrototypePort;
    const isUnlinked = !this.isConnected;
    return finalPrototypePort && isUnlinked;
  }

  get isConnected() {
    return !!this.engine.getLinkIDsByPortID(this.portID).length;
  }

  get isConnectedToActions() {
    return this.resolveTargetNode()?.type === BlockType.ACTIONS;
  }

  get linkID() {
    const linksIDs = this.engine.getLinkIDsByPortID(this.portID);

    return linksIDs[0] ?? null;
  }

  get nodeID() {
    return this.resolve().nodeID;
  }

  get targetNodeID() {
    return this.resolveLink()?.target.nodeID ?? null;
  }

  constructor(
    engine: Engine,
    public portID: string
  ) {
    super(EntityType.PORT, engine, engine.log.child('port', portID.slice(-6)));

    this.log.debug(this.log.init('constructed port'), this.log.slug(portID));
  }

  useLinkSubscription<T>(
    id: string,
    selector: () => T,
    isEqual: (lhs: T | null, rhs: T | null) => boolean = isDirectlyEqual
  ) {
    let prevState: T | null = null;

    return this.engine.dispatcher.useSubscription(EntityType.LINK, id, (isForced) => {
      const state = selector();

      this.log.debug(this.log.pending('redrawing link'));

      if (isForced || !this.instance?.isReady() || !isEqual(state, prevState)) {
        this.handlers.forEach((handler) => handler(this));
        prevState = state;

        this.log.debug(this.log.success('redraw link complete'), this.log.value(this.handlers.length));
      } else {
        this.log.debug(this.log.failure('redraw link skipped'));
      }
    });
  }

  resolve() {
    return this.engine.getPortByID(this.portID)!;
  }

  resolveLink() {
    return this.engine.getLinkByID(this.linkID);
  }

  resolveTargetNode() {
    const { linkID } = this;

    if (!linkID) return null;

    return this.engine.getTargetNodeByLinkID(linkID);
  }

  useInstance(instance: PortInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.portID);
    this.useLinkSubscription(this.linkID, () => this.resolveLink());

    React.useEffect(() => {
      engine.registerPort(this.portID, this);

      return () => {
        engine.expirePort(this.portID, this.instanceID);
      };
    }, []);
  }

  useLifecycle() {
    const engine = React.useContext(EngineContext)!;

    useSetup(() => engine.port.redrawLinks(this.portID));
  }
}

export default PortEntity;
