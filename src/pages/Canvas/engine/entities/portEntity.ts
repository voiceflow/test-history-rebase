import React from 'react';

import * as Creator from '@/ducks/creator';
import { useDidUpdateEffect } from '@/hooks';
import { Port } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';

import { EntityType } from '../constants';
import type { Engine } from '..';
import { EntityInstance, ResourceEntity } from './entity';

export type PortInstance = EntityInstance & {
  /**
   * get the DOMRect of the rendered port
   */
  getRect: () => DOMRect | null;
};

class PortEntity extends ResourceEntity<Port, PortInstance> {
  get isHighlighted() {
    return this.engine.highlight.isPortTarget(this.portID);
  }

  get isConnected() {
    return !!this.engine.getLinkIDsByPortID(this.portID).length;
  }

  constructor(engine: Engine, public portID: string) {
    super(EntityType.PORT, engine, engine.log.child(`port(${portID.slice(-6)})`));
  }

  resolve() {
    return this.engine.getPortByID(this.portID);
  }

  useInstance(instance: PortInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.portID, (state) => Creator.portByIDSelector(state)(this.portID));

    React.useEffect(() => {
      engine.registerPort(this.portID, this);

      return () => {
        engine.expirePort(this.portID, this.instanceID);
      };
    }, []);
  }

  useLifecycle() {
    const engine = React.useContext(EngineContext)!;

    useDidUpdateEffect(() => engine.port.redrawLinks(this.portID));
  }
}

export default PortEntity;
