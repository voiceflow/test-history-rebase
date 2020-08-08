import React from 'react';

import * as Thread from '@/ducks/thread';
import * as Models from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';
import { Coords, Vector } from '@/utils/geometry';

import { EntityType } from '../constants';
import type { Engine } from '..';
import { EntityInstance, ResourceEntity } from './entity';

export type ThreadInstance = EntityInstance & {
  /**
   * get the current coordinates of this thread on the canvas
   */
  getCoords: () => Coords;

  translate: (movement: Vector) => void;
};

class ThreadEntity extends ResourceEntity<Models.Thread, ThreadInstance> {
  diagramID: string;

  get isFocused() {
    return this.engine.comment.isFocused(this.threadID);
  }

  constructor(engine: Engine, public threadID: string) {
    super(EntityType.THREAD, engine, engine.log.child(`thread<${threadID.slice(-6)}>`));

    const { diagramID } = this.resolve();
    this.diagramID = diagramID;

    this.log.debug(this.log.init('constructed thread'), this.log.slug(threadID));
  }

  resolve() {
    return this.engine.select(Thread.threadByIDSelector)(this.threadID);
  }

  useCoordinates() {
    const { x, y } = this.useState((e) => {
      const {
        position: [posX, posY],
      } = e.resolve();

      return {
        x: posX,
        y: posY,
      };
    });

    return React.useMemo(() => this.engine.canvas!.toCoords([x, y]).onPlane(this.engine.canvas!.getOuterPlane()), [x, y]);
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
