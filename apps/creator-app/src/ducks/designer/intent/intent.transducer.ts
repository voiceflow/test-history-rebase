import { Actions } from '@voiceflow/sdk-logux-designer';

import { referenceVirtualUpdateAtTransducerFactory, virtualUpdateAtTransducerFactory } from '../utils/virtual-update-at-transducer.util';
import { STATE_KEY as INTENT_STATE_KEY } from './intent.state';
import { STATE_KEY as REQUIRED_ENTITY_STATE_KEY } from './required-entity/required-entity.state';
import { STATE_KEY as UTTERANCE_STATE_KEY } from './utterance/utterance.state';

export const intentUpdateAtTransducer = virtualUpdateAtTransducerFactory(
  referenceVirtualUpdateAtTransducerFactory({
    actions: Actions.Utterance,
    getRootID: (utterance) => utterance.intentID,
    rootStateKey: INTENT_STATE_KEY,
    referenceStateKey: UTTERANCE_STATE_KEY,
  }),
  referenceVirtualUpdateAtTransducerFactory({
    actions: Actions.RequiredEntity,
    getRootID: (requiredEntity) => requiredEntity.intentID,
    rootStateKey: INTENT_STATE_KEY,
    referenceStateKey: REQUIRED_ENTITY_STATE_KEY,
  })
);
