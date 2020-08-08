import { createMatchSelector } from 'connected-react-router';

import { Path } from '@/config/routes';

import { EngineConsumer } from './utils';

class PrototypeEngine extends EngineConsumer {
  log = this.engine.log.child('prototype');

  get isActive() {
    return !!this.select(createMatchSelector(Path.PROJECT_PROTOTYPE));
  }
}

export default PrototypeEngine;
