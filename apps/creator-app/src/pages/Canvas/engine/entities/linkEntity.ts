import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSetup, useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import type { Pair, PathPoints } from '@/types';

import type Engine from '..';
import { EntityType } from '../constants';
import type { EntityInstance } from './entity';
import { ResourceEntity } from './entity';

export interface TranslatePointData {
  sync: boolean;
  isSource: boolean;
  sourceAndTargetSelected: boolean;
}

export interface LinkInstance extends EntityInstance {
  /**
   * get the link's path points
   */
  getPoints: () => React.MutableRefObject<PathPoints | null>;

  /**
   * translate one of the link's points
   */
  translatePoint: (movement: Pair<number>, data: TranslatePointData) => void;
}

export interface PortLinkInstance {
  updatePosition: (points: PathPoints | null, onUpdated?: VoidFunction) => void;
}

class LinkEntity extends ResourceEntity<Realtime.Link, LinkInstance> {
  get isHighlighted() {
    return this.engine.highlight.isLinkTarget(this.linkID);
  }

  get isPrototypeHighlighted() {
    return this.engine.prototype.isLinkHighlighted(this.linkID);
  }

  get isActive() {
    return this.engine.link.isActive(this.linkID);
  }

  get isSupported() {
    return this.engine.link.isSupported(this.linkID);
  }

  get portLinkInstance() {
    return this.engine.portLinkInstances.get(this.linkID);
  }

  constructor(
    engine: Engine,
    public linkID: string
  ) {
    super(EntityType.LINK, engine, engine.log.child('link', linkID.slice(-6)));

    this.log.debug(this.log.init('constructed link'), this.log.slug(linkID));
  }

  /**
   * @deprecated use getLinkedRects
   */
  getSourceTargetPoints() {
    return this.engine.link.getSourceTargetPoints(this.linkID);
  }

  getLinkedRects() {
    return this.engine.link.getLinkedRects(this.linkID);
  }

  getSourceParentNodeRect() {
    return this.engine.link.getSourceParentNodeRect(this.linkID);
  }

  resolve() {
    return this.engine.getLinkByID(this.linkID)!;
  }

  useInstance(instance: LinkInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.linkID);

    React.useEffect(() => {
      engine.registerLink(this.linkID, this);

      return () => {
        engine.expireLink(this.linkID, this.instanceID);
      };
    }, []);
  }

  useLifecycle() {
    const engine = React.useContext(EngineContext)!;
    const link = React.useMemo(() => this.resolve(), []);

    useSetup(() => engine.link.redrawPorts(link));

    useTeardown(() => engine.link.redrawPorts(link));
  }
}

export default LinkEntity;
