import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crudV2';

export interface ProjectListState extends CRUDState<Realtime.ProjectList> {}
