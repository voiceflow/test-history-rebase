import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface ProjectState extends CRUDState<Realtime.AnyProject> {}
