import React from 'react';

import { useSetup, useTeardown } from '@/hooks';
import * as Models from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { Pair } from '@/types';

import { EntityType } from '../constants';
import type { Engine } from '..';
import { EntityInstance, ResourceEntity } from './entity';

export type LinkInstance = EntityInstance & {
  /**
   * translate one of the link's points
   */
  translatePoint: (movement: Pair<number>, isSource: boolean) => void;

  /**
   * check if the provided element is part of this link
   */
  containsElement: (node: Node) => boolean;
};

class LinkEntity extends ResourceEntity<Models.Link, LinkInstance> {
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

  constructor(engine: Engine, public linkID: string) {
    super(EntityType.LINK, engine, engine.log.child('link', linkID.slice(-6)));

    this.log.debug(this.log.init('constructed link'), this.log.slug(linkID));
  }

  getPoints() {
    return this.engine.link.getPoints(this.linkID);
  }

  resolve() {
    return this.engine.getLinkByID(this.linkID);
  }

  useInstance(instance: LinkInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.linkID, () => this.resolve());

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
