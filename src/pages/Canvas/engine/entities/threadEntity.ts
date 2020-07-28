import React from 'react';

import * as Thread from '@/ducks/thread';
import * as Models from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { Pair, Point } from '@/types';

import { EntityType } from '../constants';
import type { Engine } from '..';
import { EntityInstance, ResourceEntity } from './entity';

export type ThreadInstance = EntityInstance & {
  /**
   * get the current x and y position of this thread on the canvas
   */
  getPosition: () => Point;

  /**
   * get the center point of the rendered thread
   */
  getCenterPoint: () => Point | null;

  translate: (movement: Pair<number>) => void;
};

class ThreadEntity extends ResourceEntity<Models.Thread, ThreadInstance> {
  get isFocused() {
    return this.engine.comment.isFocused(this.threadID);
  }

  constructor(engine: Engine, public threadID: string) {
    super(EntityType.THREAD, engine, engine.log.child(`thread<${threadID.slice(-6)}>`));

    this.log.debug(this.log.init('constructed thread'), this.log.slug(threadID));
  }

  resolve() {
    return this.engine.select(Thread.threadByIDSelector)(this.threadID);
  }

  useCoordinates() {
    const { x, y } = this.useState((e) => {
      const {
        position: [positionX, positionY],
      } = e.resolve();

      return {
        x: positionX,
        y: positionY,
      };
    });

    return { x, y };
  }

  useInstance(instance: ThreadInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.threadID, () => this.resolve());

    React.useEffect(() => {
      engine.registerThread(this.threadID, this);

      return () => {
        engine.expireThread(this.threadID, this.instanceID);
      };
    }, []);
  }
}

export default ThreadEntity;
