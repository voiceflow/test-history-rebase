import React from 'react';

import { useSetup } from '@/hooks';
import { Port } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts/EngineContext';

import type { Engine } from '..';
import { EntityType } from '../constants';
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

  get isPrototypeHighlighted() {
    return this.engine.prototype.isPortHighlighted(this.portID);
  }

  get isConnected() {
    return !!this.engine.getLinkIDsByPortID(this.portID).length;
  }

  get linkID() {
    const linksIDs = this.engine.getLinkIDsByPortID(this.portID);

    return linksIDs[0] ?? null;
  }

  constructor(engine: Engine, public portID: string) {
    super(EntityType.PORT, engine, engine.log.child('port', portID.slice(-6)));

    this.log.debug(this.log.init('constructed port'), this.log.slug(portID));
  }

  resolve() {
    return this.engine.getPortByID(this.portID);
  }

  useInstance(instance: PortInstance) {
    const engine = React.useContext(EngineContext)!;

    super.useInstance(instance);
    this.useSubscription(this.portID, () => this.resolve());

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
