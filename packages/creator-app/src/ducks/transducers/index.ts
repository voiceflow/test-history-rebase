import { Utils } from '@voiceflow/common';

import { InvalidatorLookup, ReverterLookup } from '@/store/types';

import { invalidatorTransducer, reverterTransducer } from './history';
import resetTransducer from './reset';
import threadTransducer from './thread';

/**
 * transducers will be applied from right-to-left
 * to ensure a transducer is applied last then have it as the first argument in the `compose` call
 */
const stateTransducer = (reverters: ReverterLookup, invalidators: InvalidatorLookup, getClientNodeID: () => string) =>
  Utils.functional.compose(
    resetTransducer,
    threadTransducer,
    reverterTransducer(getClientNodeID, reverters),
    invalidatorTransducer(getClientNodeID, invalidators)
  );

export default stateTransducer;
