import { Actions } from '@voiceflow/sdk-logux-designer';

import { referenceVirtualUpdateAtTransducerFactory, virtualUpdateAtTransducerFactory } from '../utils/virtual-update-at-transducer.util';
import { STATE_KEY as ENTITY_STATE_KEY } from './entity.state';
import { STATE_KEY as ENTITY_VARIANT_STATE_KEY } from './entity-variant/entity-variant.state';

export const entityUpdateAtTransducer = virtualUpdateAtTransducerFactory(
  referenceVirtualUpdateAtTransducerFactory({
    actions: Actions.EntityVariant,
    getRootID: (entityVariant) => entityVariant.entityID,
    rootStateKey: ENTITY_STATE_KEY,
    referenceStateKey: ENTITY_VARIANT_STATE_KEY,
  })
);
