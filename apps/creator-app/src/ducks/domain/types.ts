import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface DomainState extends CRUDState<Realtime.Domain> {
  activeDomainID: string | null;
}
