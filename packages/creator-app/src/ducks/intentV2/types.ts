/* eslint-disable @typescript-eslint/no-empty-interface */
import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface IntentState extends CRUDState<Realtime.Intent> {}
